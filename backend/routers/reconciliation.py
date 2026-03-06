from fastapi import APIRouter, HTTPException

from models.schemas import ReconcileRequest, ReconciliationResult
from models.database import store
from services.mock_extractor import MockExtractor
from services.reconciliation_engine import ReconciliationEngine
from services.risk_engine import RiskEngine

router = APIRouter()

mock_extractor = MockExtractor()
recon_engine = ReconciliationEngine()
risk_engine = RiskEngine()


@router.post("/reconcile", response_model=ReconciliationResult)
async def reconcile(request: ReconcileRequest):
    lr_doc = store.get_document(request.lr_id)
    pod_doc = store.get_document(request.pod_id)
    inv_doc = store.get_document(request.invoice_id)

    if not all([lr_doc, pod_doc, inv_doc]):
        raise HTTPException(status_code=404, detail="One or more documents not found")

    # For now, use mock extraction (Azure integration comes later)
    lr = mock_extractor.extract_lr()
    pod = mock_extractor.extract_pod()
    invoice = mock_extractor.extract_invoice()

    result = recon_engine.reconcile(lr, pod, invoice)
    result = risk_engine.score(result)

    store.add_reconciliation(result)
    return result


@router.get("/reconcile/{session_id}", response_model=ReconciliationResult)
async def get_reconciliation(session_id: str):
    result = store.get_reconciliation(session_id)
    if not result:
        raise HTTPException(status_code=404, detail="Reconciliation session not found")
    return result


@router.get("/reconcile", response_model=list[ReconciliationResult])
async def list_reconciliations():
    return store.list_reconciliations()


@router.post("/demo/run", response_model=ReconciliationResult)
async def run_demo():
    """One-click demo: runs full pipeline with mock data."""
    lr = mock_extractor.extract_lr()
    pod = mock_extractor.extract_pod()
    invoice = mock_extractor.extract_invoice()

    result = recon_engine.reconcile(lr, pod, invoice)
    result = risk_engine.score(result)

    store.add_reconciliation(result)
    return result
