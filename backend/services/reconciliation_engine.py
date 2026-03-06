import uuid
from datetime import datetime

from models.schemas import (
    ExtractedDocument, FieldComparison, ReconciliationResult,
    MatchStatus, AuditStatus,
)


class ReconciliationEngine:
    WEIGHT_TOLERANCE_PERCENT = 2.0
    AMOUNT_TOLERANCE_PERCENT = 1.0

    def reconcile(
        self,
        lr: ExtractedDocument,
        pod: ExtractedDocument,
        invoice: ExtractedDocument,
    ) -> ReconciliationResult:
        comparisons: list[FieldComparison] = []

        # Header field comparisons
        comparisons.append(
            self._compare_text("vendor_name", "Vendor Name",
                               lr.vendor_name, pod.vendor_name, invoice.vendor_name)
        )
        comparisons.append(
            self._compare_text("vendor_gstin", "Vendor GSTIN",
                               lr.vendor_gstin, pod.vendor_gstin, invoice.vendor_gstin)
        )
        comparisons.append(
            self._compare_text("customer_gstin", "Customer GSTIN",
                               lr.customer_gstin, pod.customer_gstin, invoice.customer_gstin)
        )
        comparisons.append(
            self._compare_text("vehicle_number", "Vehicle Number",
                               lr.vehicle_number, pod.vehicle_number, invoice.vehicle_number)
        )
        comparisons.append(
            self._compare_text("origin", "Origin",
                               lr.origin, pod.origin, invoice.origin)
        )
        comparisons.append(
            self._compare_text("destination", "Destination",
                               lr.destination, pod.destination, invoice.destination)
        )

        # Numeric field comparisons
        comparisons.append(
            self._compare_numeric("total_weight", "Total Weight (kg)",
                                  lr.total_weight, pod.total_weight, invoice.total_weight,
                                  self.WEIGHT_TOLERANCE_PERCENT)
        )
        comparisons.append(
            self._compare_numeric("number_of_packages", "Number of Packages",
                                  float(lr.number_of_packages) if lr.number_of_packages else None,
                                  float(pod.number_of_packages) if pod.number_of_packages else None,
                                  float(invoice.number_of_packages) if invoice.number_of_packages else None,
                                  0)
        )
        # Use invoice subtotal (pre-tax) for fair comparison with LR/POD
        inv_comparable_amount = invoice.subtotal if invoice.subtotal else invoice.total_amount
        comparisons.append(
            self._compare_numeric("subtotal_amount", "Subtotal Amount (Rs)",
                                  lr.total_amount, pod.total_amount, inv_comparable_amount,
                                  self.AMOUNT_TOLERANCE_PERCENT)
        )
        # Also show total invoice amount (with tax) as info
        if invoice.tax_amount and invoice.total_amount:
            comparisons.append(
                FieldComparison(
                    field_name="invoice_tax", display_name="Invoice Tax (GST)",
                    lr_value="N/A", pod_value="N/A",
                    invoice_value=f"{invoice.tax_amount:,.2f}",
                    match_status=MatchStatus.MATCHED,
                )
            )
            comparisons.append(
                FieldComparison(
                    field_name="invoice_total", display_name="Invoice Total (incl. Tax)",
                    lr_value="N/A", pod_value="N/A",
                    invoice_value=f"{invoice.total_amount:,.2f}",
                    match_status=MatchStatus.MATCHED,
                )
            )

        # Line item matching
        line_matches = self._match_line_items(lr.items, pod.items, invoice.items)

        # Aggregate stats
        matched = sum(1 for c in comparisons if c.match_status == MatchStatus.MATCHED)
        mismatched = sum(1 for c in comparisons if c.match_status == MatchStatus.MISMATCHED)
        missing = sum(1 for c in comparisons if c.match_status == MatchStatus.MISSING)
        total = len(comparisons)
        match_score = (matched / total * 100) if total > 0 else 0

        return ReconciliationResult(
            session_id=str(uuid.uuid4())[:8].upper(),
            created_at=datetime.now(),
            status=AuditStatus.COMPLETED,
            lorry_receipt=lr,
            proof_of_delivery=pod,
            invoice=invoice,
            field_comparisons=comparisons,
            line_item_matches=line_matches,
            overall_match_score=round(match_score, 1),
            total_fields_compared=total,
            fields_matched=matched,
            fields_mismatched=mismatched,
            fields_missing=missing,
        )

    def _compare_text(
        self, field_name: str, display_name: str,
        lr_val: str | None, pod_val: str | None, inv_val: str | None,
    ) -> FieldComparison:
        values = [v for v in [lr_val, pod_val, inv_val] if v is not None]
        if len(values) < 2:
            return FieldComparison(
                field_name=field_name, display_name=display_name,
                lr_value=lr_val, pod_value=pod_val, invoice_value=inv_val,
                match_status=MatchStatus.MISSING,
            )
        normalized = [v.strip().lower() for v in values]
        status = MatchStatus.MATCHED if len(set(normalized)) == 1 else MatchStatus.MISMATCHED
        return FieldComparison(
            field_name=field_name, display_name=display_name,
            lr_value=lr_val, pod_value=pod_val, invoice_value=inv_val,
            match_status=status,
            risk_contribution=10.0 if status == MatchStatus.MISMATCHED else 0.0,
        )

    def _compare_numeric(
        self, field_name: str, display_name: str,
        lr_val: float | None, pod_val: float | None, inv_val: float | None,
        tolerance: float,
    ) -> FieldComparison:
        values = [v for v in [lr_val, pod_val, inv_val] if v is not None]
        if len(values) < 2:
            return FieldComparison(
                field_name=field_name, display_name=display_name,
                lr_value=str(lr_val) if lr_val is not None else None,
                pod_value=str(pod_val) if pod_val is not None else None,
                invoice_value=str(inv_val) if inv_val is not None else None,
                match_status=MatchStatus.MISSING,
            )

        max_val = max(values)
        min_val = min(values)
        deviation = ((max_val - min_val) / max_val * 100) if max_val > 0 else 0
        status = MatchStatus.MATCHED if deviation <= tolerance else MatchStatus.MISMATCHED

        risk = 0.0
        if status == MatchStatus.MISMATCHED:
            if "weight" in field_name:
                risk = deviation * 8
            elif "amount" in field_name:
                risk = deviation * 10
            else:
                risk = deviation * 5

        return FieldComparison(
            field_name=field_name, display_name=display_name,
            lr_value=f"{lr_val:,.2f}" if lr_val is not None else None,
            pod_value=f"{pod_val:,.2f}" if pod_val is not None else None,
            invoice_value=f"{inv_val:,.2f}" if inv_val is not None else None,
            match_status=status,
            deviation_percent=round(deviation, 2),
            risk_contribution=round(risk, 2),
        )

    def _match_line_items(self, lr_items, pod_items, inv_items) -> list[dict]:
        matches = []
        for lr_item in lr_items:
            best_pod = self._find_best_match(lr_item, pod_items)
            best_inv = self._find_best_match(lr_item, inv_items)

            qty_match = True
            amount_match = True

            quantities = []
            if lr_item.quantity is not None:
                quantities.append(lr_item.quantity)
            if best_pod and best_pod.quantity is not None:
                quantities.append(best_pod.quantity)
            if best_inv and best_inv.quantity is not None:
                quantities.append(best_inv.quantity)
            if len(quantities) >= 2 and len(set(quantities)) > 1:
                qty_match = False

            amounts = []
            if lr_item.amount is not None:
                amounts.append(lr_item.amount)
            if best_pod and best_pod.amount is not None:
                amounts.append(best_pod.amount)
            if best_inv and best_inv.amount is not None:
                amounts.append(best_inv.amount)
            if len(amounts) >= 2:
                max_a = max(amounts)
                min_a = min(amounts)
                if max_a > 0 and ((max_a - min_a) / max_a * 100) > 1.0:
                    amount_match = False

            matches.append({
                "lr_item": lr_item.model_dump(),
                "pod_item": best_pod.model_dump() if best_pod else None,
                "invoice_item": best_inv.model_dump() if best_inv else None,
                "quantity_match": qty_match,
                "amount_match": amount_match,
            })
        return matches

    def _find_best_match(self, target, candidates):
        if not candidates:
            return None
        target_desc = target.description.lower().strip()
        best = None
        best_score = 0
        for candidate in candidates:
            cand_desc = candidate.description.lower().strip()
            if target_desc == cand_desc:
                return candidate
            # Simple word overlap matching
            target_words = set(target_desc.split())
            cand_words = set(cand_desc.split())
            overlap = len(target_words & cand_words)
            if overlap > best_score:
                best_score = overlap
                best = candidate
        return best if best_score > 0 else None
