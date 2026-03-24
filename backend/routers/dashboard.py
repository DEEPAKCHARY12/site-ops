from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from .. import crud, schemas
from ..database import get_db

router = APIRouter(
    prefix="/api/dashboard",
    tags=["dashboard"],
)

@router.get("/kpis", response_model=schemas.DashboardKPIs)
def read_dashboard_kpis(date: str, db: Session = Depends(get_db)):
    return crud.get_dashboard_kpis(db, date=date)

@router.get("/inventory-summary", response_model=List[schemas.InventorySummaryItem])
def read_inventory_summary(db: Session = Depends(get_db)):
    return crud.get_dashboard_inventory_summary(db)

@router.get("/timeline", response_model=List[schemas.TimelineEvent])
def read_timeline(db: Session = Depends(get_db)):
    # Mocking timeline for now as per implementation plan or fetch from activities
    return [
        {"time": "08:15 AM", "description": "Site Briefing & Safety Check Completed", "status": "past"},
        {"time": "10:30 AM", "description": "Steel reinforcement delivery received at Zone 4", "status": "past"},
        {"time": "01:45 PM", "description": "Slab pouring phase III in progress", "status": "current"},
    ]

@router.post("/daily-entry", response_model=schemas.DailyEntry)
def create_entry(db: Session = Depends(get_db)):
    date = datetime.utcnow().strftime("%Y-%m-%d")
    return crud.create_daily_entry(db, date=date)

@router.get("/sync-history", response_model=List[schemas.SyncHistoryItem])
def read_sync_history(db: Session = Depends(get_db)):
    return crud.get_sync_history(db)

@router.post("/finalize-day")
def finalize_day(date: str, db: Session = Depends(get_db)):
    db_entry = crud.finalize_day(db, date=date)
    if not db_entry:
        raise HTTPException(status_code=404, detail="Daily entry not found")
    return {"message": "Day finalized and synced successfully"}
