from fastapi import APIRouter

from models.schemas import DashboardStats
from models.database import store

router = APIRouter()


@router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    return store.get_stats()
