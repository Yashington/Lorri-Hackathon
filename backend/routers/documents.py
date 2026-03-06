import os
import uuid

from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from config import settings
from models.schemas import DocumentType, UploadResponse
from models.database import store

router = APIRouter()


@router.post("/documents/upload", response_model=UploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    doc_type: DocumentType = Form(...),
):
    doc_id = str(uuid.uuid4())[:8].upper()
    upload_dir = settings.UPLOAD_DIR
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, f"{doc_id}_{file.filename}")
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    metadata = {
        "document_id": doc_id,
        "file_name": file.filename,
        "file_path": file_path,
        "doc_type": doc_type.value,
        "status": "uploaded",
    }
    store.add_document(doc_id, metadata)

    return UploadResponse(
        document_id=doc_id,
        file_name=file.filename,
        doc_type=doc_type,
        status="uploaded",
    )


@router.get("/documents/{document_id}")
async def get_document(document_id: str):
    doc = store.get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc
