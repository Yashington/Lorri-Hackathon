import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import settings
from routers import documents, reconciliation, dashboard

app = FastAPI(
    title="ReconAI",
    version="1.0.0",
    description="Agentic Document Intelligence for 3-Way Logistics Matching",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router, prefix="/api", tags=["Documents"])
app.include_router(reconciliation.router, prefix="/api", tags=["Reconciliation"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "ReconAI", "version": "1.0.0"}
