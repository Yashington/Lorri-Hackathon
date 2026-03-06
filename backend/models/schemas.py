from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from typing import Optional


class DocumentType(str, Enum):
    LORRY_RECEIPT = "lorry_receipt"
    PROOF_OF_DELIVERY = "proof_of_delivery"
    INVOICE = "invoice"


class MatchStatus(str, Enum):
    MATCHED = "matched"
    MISMATCHED = "mismatched"
    PARTIAL = "partial"
    MISSING = "missing"


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class AuditStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FLAGGED = "flagged"


class LineItem(BaseModel):
    description: str
    quantity: Optional[float] = None
    unit: Optional[str] = None
    unit_price: Optional[float] = None
    amount: Optional[float] = None
    hsn_code: Optional[str] = None


class ExtractedDocument(BaseModel):
    doc_type: DocumentType
    file_name: str
    document_number: Optional[str] = None
    date: Optional[str] = None
    vendor_name: Optional[str] = None
    vendor_gstin: Optional[str] = None
    customer_name: Optional[str] = None
    customer_gstin: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    vehicle_number: Optional[str] = None
    total_weight: Optional[float] = None
    weight_unit: Optional[str] = "kg"
    number_of_packages: Optional[int] = None
    subtotal: Optional[float] = None
    tax_amount: Optional[float] = None
    total_amount: Optional[float] = None
    items: list[LineItem] = []
    confidence_score: float = 0.0
    raw_text: Optional[str] = None


class FieldComparison(BaseModel):
    field_name: str
    display_name: str
    lr_value: Optional[str] = None
    pod_value: Optional[str] = None
    invoice_value: Optional[str] = None
    match_status: MatchStatus
    deviation_percent: Optional[float] = None
    risk_contribution: float = 0.0


class ReconciliationResult(BaseModel):
    session_id: str
    created_at: datetime
    status: AuditStatus
    lorry_receipt: ExtractedDocument
    proof_of_delivery: ExtractedDocument
    invoice: ExtractedDocument
    field_comparisons: list[FieldComparison] = []
    line_item_matches: list[dict] = []
    overall_match_score: float = 0.0
    risk_score: float = 0.0
    risk_level: RiskLevel = RiskLevel.LOW
    total_fields_compared: int = 0
    fields_matched: int = 0
    fields_mismatched: int = 0
    fields_missing: int = 0
    discrepancy_summary: list[str] = []
    recommendation: str = ""


class DashboardStats(BaseModel):
    total_audits: int = 0
    audits_today: int = 0
    average_match_rate: float = 0.0
    high_risk_count: int = 0
    auto_approved: int = 0
    needs_review: int = 0
    rejected: int = 0
    recent_audits: list[ReconciliationResult] = []


class UploadResponse(BaseModel):
    document_id: str
    file_name: str
    doc_type: DocumentType
    status: str


class ReconcileRequest(BaseModel):
    lr_id: str
    pod_id: str
    invoice_id: str
