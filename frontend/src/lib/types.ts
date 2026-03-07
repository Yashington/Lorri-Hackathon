export type DocumentType = "lorry_receipt" | "proof_of_delivery" | "invoice";
export type MatchStatus = "matched" | "mismatched" | "partial" | "missing";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type AuditStatus = "pending" | "processing" | "completed" | "flagged";

export interface LineItem {
  description: string;
  quantity?: number;
  unit?: string;
  unit_price?: number;
  amount?: number;
  hsn_code?: string;
}

export interface ExtractedDocument {
  doc_type: DocumentType;
  file_name: string;
  document_number?: string;
  date?: string;
  vendor_name?: string;
  vendor_gstin?: string;
  customer_name?: string;
  customer_gstin?: string;
  origin?: string;
  destination?: string;
  vehicle_number?: string;
  total_weight?: number;
  weight_unit?: string;
  number_of_packages?: number;
  subtotal?: number;
  tax_amount?: number;
  total_amount?: number;
  items: LineItem[];
  confidence_score: number;
  raw_text?: string;
}

export interface FieldComparison {
  field_name: string;
  display_name: string;
  lr_value?: string;
  pod_value?: string;
  invoice_value?: string;
  match_status: MatchStatus;
  deviation_percent?: number;
  risk_contribution: number;
}

export interface ReconciliationResult {
  session_id: string;
  created_at: string;
  status: AuditStatus;
  lorry_receipt: ExtractedDocument;
  proof_of_delivery: ExtractedDocument;
  invoice: ExtractedDocument;
  field_comparisons: FieldComparison[];
  line_item_matches: LineItemMatch[];
  overall_match_score: number;
  risk_score: number;
  risk_level: RiskLevel;
  total_fields_compared: number;
  fields_matched: number;
  fields_mismatched: number;
  fields_missing: number;
  discrepancy_summary: string[];
  recommendation: string;
}

export interface LineItemMatch {
  lr_item: LineItem;
  pod_item: LineItem | null;
  invoice_item: LineItem | null;
  quantity_match: boolean;
  amount_match: boolean;
}

export interface DashboardStats {
  total_audits: number;
  audits_today: number;
  average_match_rate: number;
  high_risk_count: number;
  auto_approved: number;
  needs_review: number;
  rejected: number;
  recent_audits: ReconciliationResult[];
}

export interface UploadResponse {
  document_id: string;
  file_name: string;
  doc_type: DocumentType;
  status: string;
}

// Vendor Profiling
export interface VendorProfile {
  vendor_id: string;
  vendor_name: string;
  vendor_gstin: string;
  total_audits: number;
  average_match_rate: number;
  high_risk_incidents: number;
  reliability_score: number; // 0-100
  last_audit_date: string;
  trend: "improving" | "stable" | "declining";
  common_discrepancies: string[];
  match_rate_trend: { date: string; rate: number }[];
}

// Fraud Detection
export interface FraudIndicator {
  id: string;
  audit_id: string;
  indicator_type: "gstin_mismatch" | "large_deviation" | "pattern_anomaly" | "vendor_repeat";
  severity: "low" | "medium" | "high";
  description: string;
  probability: number; // 0-100
  detected_at: string;
}

export interface FraudReport {
  total_audits: number;
  high_risk_audits: number;
  fraud_probability: number;
  top_indicators: FraudIndicator[];
  suspicious_vendors: VendorProfile[];
}

// Audit Trail & Comments
export interface AuditAction {
  action_id: string;
  audit_id: string;
  action_type: "viewed" | "approved" | "flagged" | "commented" | "overridden";
  actor_name: string;
  timestamp: string;
  details?: string;
  field_name?: string;
  old_value?: string;
  new_value?: string;
}

export interface AuditComment {
  comment_id: string;
  audit_id: string;
  author: string;
  content: string;
  timestamp: string;
  is_internal: boolean;
}

// Enhanced Reconciliation with metadata
export interface ReconciliationMetadata {
  discrepancy_timeline: { timestamp: string; discrepancy: string; resolved: boolean }[];
  manual_overrides: { field: string; original_status: MatchStatus; new_status: MatchStatus; reason: string }[];
  comments: AuditComment[];
  related_audits: string[]; // session IDs from same vendor
}

// Export & Reporting
export interface ExportOptions {
  format: "pdf" | "csv" | "excel";
  include_charts: boolean;
  include_raw_data: boolean;
  include_recommendations: boolean;
}

export interface BatchAudit {
  batch_id: string;
  total_files: number;
  completed: number;
  failed: number;
  status: "pending" | "processing" | "completed";
  created_at: string;
  audits: ReconciliationResult[];
  consolidated_stats: {
    average_match_rate: number;
    fraud_risk_summary: string;
    total_discrepancies: number;
  };
}

// Global Filter & Search
export interface SearchFilters {
  startDate?: string;
  endDate?: string;
  riskLevel?: RiskLevel[];
  status?: AuditStatus[];
  vendor?: string;
  matchRateRange?: [number, number];
  sortBy?: "date" | "match_rate" | "risk_score";
  sortOrder?: "asc" | "desc";
}
