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
