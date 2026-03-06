export const RISK_COLORS: Record<string, { bg: string; text: string; border: string; hex: string }> = {
  low: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", hex: "#10b981" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", hex: "#f59e0b" },
  high: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", hex: "#f97316" },
  critical: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", hex: "#ef4444" },
};

export const MATCH_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  matched: { bg: "bg-green-50", text: "text-green-700", badge: "bg-green-100 text-green-800" },
  mismatched: { bg: "bg-red-50", text: "text-red-700", badge: "bg-red-100 text-red-800" },
  partial: { bg: "bg-yellow-50", text: "text-yellow-700", badge: "bg-yellow-100 text-yellow-800" },
  missing: { bg: "bg-gray-50", text: "text-gray-500", badge: "bg-gray-100 text-gray-600" },
};

export const DOC_TYPE_LABELS: Record<string, { label: string; short: string }> = {
  lorry_receipt: { label: "Lorry Receipt", short: "LR" },
  proof_of_delivery: { label: "Proof of Delivery", short: "POD" },
  invoice: { label: "Invoice", short: "INV" },
};
