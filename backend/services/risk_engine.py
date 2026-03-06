from models.schemas import (
    ReconciliationResult, MatchStatus, RiskLevel,
)


class RiskEngine:
    def score(self, result: ReconciliationResult) -> ReconciliationResult:
        risk = 0.0
        discrepancies: list[str] = []

        for comp in result.field_comparisons:
            if comp.match_status == MatchStatus.MISMATCHED:
                risk += comp.risk_contribution

                if comp.field_name == "total_weight":
                    discrepancies.append(
                        f"Weight mismatch: LR={comp.lr_value}kg, POD={comp.pod_value}kg "
                        f"({comp.deviation_percent}% deviation)"
                    )
                elif comp.field_name in ("total_amount", "subtotal_amount"):
                    discrepancies.append(
                        f"Amount mismatch: LR=Rs {comp.lr_value}, POD=Rs {comp.pod_value}, "
                        f"Invoice=Rs {comp.invoice_value} ({comp.deviation_percent}% deviation)"
                    )
                elif comp.field_name == "number_of_packages":
                    discrepancies.append(
                        f"Package count mismatch: LR={comp.lr_value}, POD={comp.pod_value}, "
                        f"Invoice={comp.invoice_value}"
                    )
                elif comp.field_name == "vendor_gstin":
                    risk += 25
                    discrepancies.append(
                        "GSTIN mismatch across documents - potential fraud indicator"
                    )
                elif comp.match_status == MatchStatus.MISMATCHED:
                    discrepancies.append(
                        f"{comp.display_name} mismatch: LR={comp.lr_value}, "
                        f"POD={comp.pod_value}, Invoice={comp.invoice_value}"
                    )

            elif comp.match_status == MatchStatus.MISSING:
                risk += 5
                discrepancies.append(f"Missing field: {comp.display_name}")

        # Line item penalties
        for lm in result.line_item_matches:
            if not lm.get("quantity_match"):
                risk += 15
                lr_item = lm.get("lr_item", {})
                pod_item = lm.get("pod_item", {})
                inv_item = lm.get("invoice_item", {})
                discrepancies.append(
                    f"Line item qty mismatch: '{lr_item.get('description', 'Unknown')}' - "
                    f"LR={lr_item.get('quantity')}, POD={pod_item.get('quantity') if pod_item else 'N/A'}, "
                    f"Invoice={inv_item.get('quantity') if inv_item else 'N/A'}"
                )

        risk = min(risk, 100.0)

        if risk <= 20:
            level = RiskLevel.LOW
            rec = "AUTO-APPROVE: All fields within acceptable tolerance. Payment can be processed."
        elif risk <= 45:
            level = RiskLevel.MEDIUM
            rec = "REVIEW: Minor discrepancies detected. Manual verification recommended before payment."
        elif risk <= 70:
            level = RiskLevel.HIGH
            rec = "FLAG: Significant discrepancies found. Senior finance review required."
        else:
            level = RiskLevel.CRITICAL
            rec = "REJECT: Critical mismatches detected. Possible fraud or major logistics errors. Escalate immediately."

        result.risk_score = round(risk, 1)
        result.risk_level = level
        result.recommendation = rec
        result.discrepancy_summary = discrepancies
        return result
