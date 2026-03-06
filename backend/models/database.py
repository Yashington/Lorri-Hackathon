from datetime import datetime, timedelta
from models.schemas import (
    ExtractedDocument, DocumentType, LineItem, FieldComparison,
    ReconciliationResult, MatchStatus, RiskLevel, AuditStatus,
    DashboardStats,
)


class InMemoryStore:
    def __init__(self):
        self.documents: dict[str, dict] = {}
        self.extractions: dict[str, ExtractedDocument] = {}
        self.reconciliations: dict[str, ReconciliationResult] = {}
        self._seed_demo_data()

    def add_document(self, doc_id: str, metadata: dict):
        self.documents[doc_id] = metadata

    def get_document(self, doc_id: str) -> dict | None:
        return self.documents.get(doc_id)

    def add_reconciliation(self, result: ReconciliationResult):
        self.reconciliations[result.session_id] = result

    def get_reconciliation(self, session_id: str) -> ReconciliationResult | None:
        return self.reconciliations.get(session_id)

    def list_reconciliations(self) -> list[ReconciliationResult]:
        return list(reversed(self.reconciliations.values()))

    def get_stats(self) -> DashboardStats:
        all_recons = list(self.reconciliations.values())
        today = datetime.now().date()
        today_audits = [r for r in all_recons if r.created_at.date() == today]
        avg_match = (
            sum(r.overall_match_score for r in all_recons) / len(all_recons)
            if all_recons else 0
        )
        high_risk = sum(
            1 for r in all_recons
            if r.risk_level in (RiskLevel.HIGH, RiskLevel.CRITICAL)
        )
        auto_approved = sum(1 for r in all_recons if r.risk_level == RiskLevel.LOW)
        needs_review = sum(1 for r in all_recons if r.risk_level == RiskLevel.MEDIUM)
        rejected = sum(1 for r in all_recons if r.risk_level == RiskLevel.CRITICAL)

        return DashboardStats(
            total_audits=len(all_recons),
            audits_today=len(today_audits),
            average_match_rate=round(avg_match, 1),
            high_risk_count=high_risk,
            auto_approved=auto_approved,
            needs_review=needs_review,
            rejected=rejected,
            recent_audits=list(reversed(all_recons))[:10],
        )

    def _seed_demo_data(self):
        """Pre-populate with historical reconciliation results."""
        seeds = [
            ("HIST-001", -5, "Bharat Transport Co", "22AAABT1234K1Z5", RiskLevel.LOW,
             92.0, 8.5, 4200, 4200, 4200, 80, 80, 80, 32000, 32000, 37760),
            ("HIST-002", -4, "Express Movers Ltd", "27AACEM5678L1Z3", RiskLevel.LOW,
             88.9, 12.0, 6100, 6100, 6100, 200, 200, 200, 78000, 78000, 92040),
            ("HIST-003", -3, "SafeHaul Logistics", "29AABCS9012M1Z7", RiskLevel.MEDIUM,
             66.7, 35.2, 3500, 3350, 3500, 95, 92, 95, 41000, 39500, 48380),
            ("HIST-004", -2, "QuickShip India Pvt Ltd", "33AADCQ3456N1Z1", RiskLevel.HIGH,
             55.6, 58.0, 7800, 7200, 7800, 150, 142, 150, 125000, 118000, 147500),
            ("HIST-005", -1, "National Freight Services", "07AAACN7890P1Z9", RiskLevel.LOW,
             100.0, 5.0, 2800, 2800, 2800, 60, 60, 60, 25000, 25000, 29500),
        ]

        for (sid, days_ago, vendor, gstin, risk_level, match_score, risk_score,
             lr_wt, pod_wt, inv_wt, lr_pkg, pod_pkg, inv_pkg,
             lr_amt, pod_amt, inv_amt) in seeds:

            lr = ExtractedDocument(
                doc_type=DocumentType.LORRY_RECEIPT,
                file_name=f"{sid}_lr.pdf",
                document_number=f"LR-2024-{sid[-3:]}",
                date=(datetime.now() + timedelta(days=days_ago)).strftime("%Y-%m-%d"),
                vendor_name=vendor, vendor_gstin=gstin,
                customer_name="Acme Corp", customer_gstin="27AAACA1234A1Z5",
                origin="Mumbai", destination="Delhi",
                vehicle_number="MH-01-XX-9999",
                total_weight=float(lr_wt), number_of_packages=lr_pkg,
                total_amount=float(lr_amt),
                items=[LineItem(description="General Cargo", quantity=lr_pkg, unit="boxes", amount=float(lr_amt))],
                confidence_score=0.92,
            )
            pod = ExtractedDocument(
                doc_type=DocumentType.PROOF_OF_DELIVERY,
                file_name=f"{sid}_pod.pdf",
                document_number=f"POD-2024-{sid[-3:]}",
                date=(datetime.now() + timedelta(days=days_ago + 2)).strftime("%Y-%m-%d"),
                vendor_name=vendor, vendor_gstin=gstin,
                customer_name="Acme Corp", customer_gstin="27AAACA1234A1Z5",
                origin="Mumbai", destination="Delhi",
                vehicle_number="MH-01-XX-9999",
                total_weight=float(pod_wt), number_of_packages=pod_pkg,
                total_amount=float(pod_amt),
                items=[LineItem(description="General Cargo", quantity=pod_pkg, unit="boxes", amount=float(pod_amt))],
                confidence_score=0.89,
            )
            inv = ExtractedDocument(
                doc_type=DocumentType.INVOICE,
                file_name=f"{sid}_invoice.pdf",
                document_number=f"INV-2024-{sid[-3:]}",
                date=(datetime.now() + timedelta(days=days_ago + 3)).strftime("%Y-%m-%d"),
                vendor_name=vendor, vendor_gstin=gstin,
                customer_name="Acme Corp", customer_gstin="27AAACA1234A1Z5",
                total_weight=float(inv_wt), number_of_packages=inv_pkg,
                subtotal=float(inv_amt) * 0.85,
                tax_amount=float(inv_amt) * 0.15,
                total_amount=float(inv_amt),
                items=[LineItem(description="General Cargo", quantity=inv_pkg, unit="boxes", amount=float(inv_amt))],
                confidence_score=0.95,
            )

            # Build comparisons
            comparisons = []
            wt_vals = [lr_wt, pod_wt, inv_wt]
            wt_dev = ((max(wt_vals) - min(wt_vals)) / max(wt_vals) * 100) if max(wt_vals) > 0 else 0
            comparisons.append(FieldComparison(
                field_name="vendor_name", display_name="Vendor Name",
                lr_value=vendor, pod_value=vendor, invoice_value=vendor,
                match_status=MatchStatus.MATCHED,
            ))
            comparisons.append(FieldComparison(
                field_name="vendor_gstin", display_name="Vendor GSTIN",
                lr_value=gstin, pod_value=gstin, invoice_value=gstin,
                match_status=MatchStatus.MATCHED,
            ))
            comparisons.append(FieldComparison(
                field_name="total_weight", display_name="Total Weight (kg)",
                lr_value=f"{lr_wt:,.2f}", pod_value=f"{pod_wt:,.2f}", invoice_value=f"{inv_wt:,.2f}",
                match_status=MatchStatus.MATCHED if wt_dev <= 2 else MatchStatus.MISMATCHED,
                deviation_percent=round(wt_dev, 2),
                risk_contribution=round(wt_dev * 8, 2) if wt_dev > 2 else 0,
            ))
            pkg_match = lr_pkg == pod_pkg == inv_pkg
            comparisons.append(FieldComparison(
                field_name="number_of_packages", display_name="Number of Packages",
                lr_value=str(lr_pkg), pod_value=str(pod_pkg), invoice_value=str(inv_pkg),
                match_status=MatchStatus.MATCHED if pkg_match else MatchStatus.MISMATCHED,
                risk_contribution=0 if pkg_match else 8.0,
            ))
            amt_vals = [lr_amt, pod_amt, inv_amt]
            amt_dev = ((max(amt_vals) - min(amt_vals)) / max(amt_vals) * 100) if max(amt_vals) > 0 else 0
            comparisons.append(FieldComparison(
                field_name="total_amount", display_name="Total Amount (Rs)",
                lr_value=f"{lr_amt:,.2f}", pod_value=f"{pod_amt:,.2f}", invoice_value=f"{inv_amt:,.2f}",
                match_status=MatchStatus.MATCHED if amt_dev <= 1 else MatchStatus.MISMATCHED,
                deviation_percent=round(amt_dev, 2),
                risk_contribution=round(amt_dev * 10, 2) if amt_dev > 1 else 0,
            ))

            matched = sum(1 for c in comparisons if c.match_status == MatchStatus.MATCHED)

            discrepancies = []
            if wt_dev > 2:
                discrepancies.append(f"Weight mismatch: {wt_dev:.1f}% deviation")
            if not pkg_match:
                discrepancies.append(f"Package count: LR={lr_pkg}, POD={pod_pkg}")
            if amt_dev > 1:
                discrepancies.append(f"Amount mismatch: {amt_dev:.1f}% deviation")

            if risk_level == RiskLevel.LOW:
                rec = "AUTO-APPROVE: All fields within acceptable tolerance."
            elif risk_level == RiskLevel.MEDIUM:
                rec = "REVIEW: Minor discrepancies detected. Manual verification recommended."
            elif risk_level == RiskLevel.HIGH:
                rec = "FLAG: Significant discrepancies found. Senior finance review required."
            else:
                rec = "REJECT: Critical mismatches detected."

            result = ReconciliationResult(
                session_id=sid,
                created_at=datetime.now() + timedelta(days=days_ago),
                status=AuditStatus.COMPLETED if risk_level != RiskLevel.HIGH else AuditStatus.FLAGGED,
                lorry_receipt=lr, proof_of_delivery=pod, invoice=inv,
                field_comparisons=comparisons,
                line_item_matches=[],
                overall_match_score=match_score,
                risk_score=risk_score,
                risk_level=risk_level,
                total_fields_compared=len(comparisons),
                fields_matched=matched,
                fields_mismatched=len(comparisons) - matched,
                fields_missing=0,
                discrepancy_summary=discrepancies,
                recommendation=rec,
            )
            self.reconciliations[sid] = result


store = InMemoryStore()
