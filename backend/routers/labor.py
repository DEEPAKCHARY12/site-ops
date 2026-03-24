from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
import math

from .. import crud, schemas
from ..database import get_db

router = APIRouter(
    prefix="/api/labor",
    tags=["labor"],
)

@router.get("/workers", response_model=schemas.PaginatedWorkers)
def read_workers(
    date: str,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1),
    db: Session = Depends(get_db)
):
    items, total = crud.get_workers(db, page=page, limit=limit, date=date)
    pages = math.ceil(total / limit)
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages
    }

@router.post("/workers", response_model=schemas.Worker)
def create_worker(worker: schemas.WorkerCreate, db: Session = Depends(get_db)):
    return crud.create_worker(db=db, worker=worker)

@router.delete("/workers/{worker_id}")
def delete_worker(worker_id: int, db: Session = Depends(get_db)):
    db_worker = crud.delete_worker(db, worker_id=worker_id)
    if not db_worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    return {"message": "Worker deleted successfully"}

@router.put("/attendance")
def update_attendance(attendance: schemas.AttendanceUpdate, db: Session = Depends(get_db)):
    db_attendance = crud.update_attendance(db, attendance=attendance)
    if not db_attendance:
        raise HTTPException(status_code=404, detail="Worker not found")
    return db_attendance

@router.get("/summary", response_model=schemas.LaborSummary)
def read_labor_summary(date: str, db: Session = Depends(get_db)):
    return crud.get_labor_summary(db, date=date)
