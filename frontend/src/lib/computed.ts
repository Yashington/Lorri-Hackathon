import type { ReconciliationResult } from "./types";

// --- Vendor Stats ---
export interface VendorStat {
  vendor_name: string;
  avg_match_rate: number;
  recent_audits: number;
  risk_incidents: number;
}

export function computeVendorStats(audits: ReconciliationResult[]): VendorStat[] {
  const vendorMap = new Map<string, { matchRates: number[]; riskIncidents: number }>();

  for (const audit of audits) {
    const name = audit.lorry_receipt.vendor_name || "Unknown";
    const existing = vendorMap.get(name) || { matchRates: [], riskIncidents: 0 };
    existing.matchRates.push(audit.overall_match_score);
    if (audit.risk_level === "high" || audit.risk_level === "critical") {
      existing.riskIncidents++;
    }
    vendorMap.set(name, existing);
  }

  return Array.from(vendorMap.entries()).map(([name, data]) => ({
    vendor_name: name,
    avg_match_rate: Math.round(data.matchRates.reduce((a, b) => a + b, 0) / data.matchRates.length),
    recent_audits: data.matchRates.length,
    risk_incidents: data.riskIncidents,
  }));
}

// --- Risk Distribution ---
export interface RiskDistItem {
  name: string;
  value: number;
  color: string;
}

const RISK_CHART_COLORS: Record<string, string> = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
  critical: "#7c3aed",
};

export function computeRiskDistribution(audits: ReconciliationResult[]): RiskDistItem[] {
  const counts: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
  for (const audit of audits) {
    counts[audit.risk_level] = (counts[audit.risk_level] || 0) + 1;
  }
  return [
    { name: "Low", value: counts.low, color: RISK_CHART_COLORS.low },
    { name: "Medium", value: counts.medium, color: RISK_CHART_COLORS.medium },
    { name: "High", value: counts.high, color: RISK_CHART_COLORS.high },
    { name: "Critical", value: counts.critical, color: RISK_CHART_COLORS.critical },
  ];
}

// --- Match Rate Trend ---
export function computeMatchRateTrend(audits: ReconciliationResult[]): { date: string; matchRate: number }[] {
  return [...audits]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((audit) => ({
      date: audit.created_at.split("T")[0],
      matchRate: audit.overall_match_score,
    }));
}

// --- Audit Volume by Date ---
export function computeAuditVolume(audits: ReconciliationResult[]): { date: string; count: number }[] {
  const dateMap = new Map<string, number>();
  for (const audit of audits) {
    const date = audit.created_at.split("T")[0];
    dateMap.set(date, (dateMap.get(date) || 0) + 1);
  }
  return Array.from(dateMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));
}

// --- Discrepancy Breakdown ---
export function computeDiscrepancyBreakdown(audits: ReconciliationResult[]): { type: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const audit of audits) {
    for (const d of audit.discrepancy_summary) {
      const lower = d.toLowerCase();
      let type = "Other";
      if (lower.includes("weight")) type = "Weight Mismatch";
      else if (lower.includes("amount")) type = "Amount Mismatch";
      else if (lower.includes("package") || lower.includes("qty") || lower.includes("quantity")) type = "Package/Qty Mismatch";
      else if (lower.includes("gstin")) type = "GSTIN Mismatch";
      else if (lower.includes("missing")) type = "Missing Field";
      counts.set(type, (counts.get(type) || 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}

// --- CSV Export ---
export function generateAuditCSV(result: ReconciliationResult): string {
  const lines: string[] = [];
  lines.push("Field,LR Value,POD Value,Invoice Value,Match Status,Deviation %,Risk Contribution");
  for (const comp of result.field_comparisons) {
    lines.push(
      [
        `"${comp.display_name}"`,
        `"${comp.lr_value || ""}"`,
        `"${comp.pod_value || ""}"`,
        `"${comp.invoice_value || ""}"`,
        comp.match_status,
        comp.deviation_percent ?? "",
        comp.risk_contribution,
      ].join(",")
    );
  }
  lines.push("");
  lines.push("Session ID," + result.session_id);
  lines.push("Overall Match Score," + result.overall_match_score + "%");
  lines.push("Risk Score," + result.risk_score);
  lines.push("Risk Level," + result.risk_level);
  lines.push("Recommendation," + `"${result.recommendation}"`);
  return lines.join("\n");
}

export function generateAllAuditsCSV(audits: ReconciliationResult[]): string {
  const lines: string[] = [];
  lines.push("Session ID,Vendor,Date,Match Rate,Risk Score,Risk Level,Status,Discrepancies");
  for (const a of audits) {
    lines.push(
      [
        a.session_id,
        `"${a.lorry_receipt.vendor_name || ""}"`,
        a.created_at.split("T")[0],
        a.overall_match_score + "%",
        a.risk_score,
        a.risk_level,
        a.status,
        `"${a.discrepancy_summary.join("; ")}"`,
      ].join(",")
    );
  }
  return lines.join("\n");
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
