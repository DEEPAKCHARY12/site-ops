from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import List, Optional
import math

from . import crud, models, schemas
from .database import SessionLocal, engine, get_db
from .routers import labor, dashboard, gallery, reports
from fastapi.staticfiles import StaticFiles
import os

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Mount static files for uploads
UPLOAD_DIR = "backend/static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(labor.router)
app.include_router(dashboard.router)
app.include_router(gallery.router)
app.include_router(reports.router)

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Site-Ops API",
        "docs_url": "/docs",
        "redoc_url": "/redoc",
        "health_check": "/health"
    }

@app.post("/api/log-interaction", response_model=schemas.InteractionLog)
def create_interaction(interaction: schemas.InteractionLogCreate, db: Session = Depends(get_db)):
    return crud.create_interaction_log(db=db, interaction=interaction)

@app.get("/api/logs", response_model=List[schemas.InteractionLog])
def read_interactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_interaction_logs(db, skip=skip, limit=limit)

# Inventory Endpoints
@app.get("/api/inventory", response_model=schemas.PaginatedInventory)
def read_inventory(
    search: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    sort_by: str = "name",
    order: str = "asc",
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1),
    db: Session = Depends(get_db)
):
    items, total = crud.get_inventory(
        db, search=search, category=category, status=status, 
        sort_by=sort_by, order=order, page=page, limit=limit
    )
    pages = math.ceil(total / limit)
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages
    }

@app.get("/api/inventory/stats", response_model=schemas.InventoryStats)
def read_inventory_stats(db: Session = Depends(get_db)):
    return crud.get_inventory_stats(db)

@app.post("/api/inventory", response_model=schemas.Material)
def create_material(material: schemas.MaterialCreate, db: Session = Depends(get_db)):
    db_material = crud.get_material_by_code(db, code=material.code)
    if db_material:
        raise HTTPException(status_code=400, detail="Material with this code already exists")
    
    new_material = crud.create_material(db=db, material=material)
    
    activity = schemas.ActivityCreate(
        user="Admin",
        action=f"added {material.name} to inventory",
        item=material.name,
        location="Warehouse 1",
        type="arrival"
    )
    crud.create_activity(db=db, activity=activity)
    
    return new_material

@app.delete("/api/inventory/{item_id}")
def delete_material(item_id: int, db: Session = Depends(get_db)):
    db_material = crud.delete_material(db, item_id=item_id)
    if not db_material:
        raise HTTPException(status_code=404, detail="Material not found")
    
    activity = schemas.ActivityCreate(
        user="Admin",
        action=f"deleted material: {db_material.name}",
        item=db_material.name,
        location="Warehouse 1",
        type="consumption"
    )
    crud.create_activity(db=db, activity=activity)
    
    return {"message": "Material deleted successfully"}

@app.post("/api/inventory/{item_id}/transaction", response_model=schemas.Material)
def create_transaction(item_id: int, transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    db_material = crud.create_transaction(db, item_id=item_id, transaction=transaction)
    if not db_material:
        raise HTTPException(status_code=404, detail="Material not found")
    return db_material

@app.get("/api/inventory/export")
def export_inventory(db: Session = Depends(get_db)):
    csv_data = crud.export_inventory_csv(db)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=inventory_report.csv"}
    )

# Activity Log
@app.get("/api/activity", response_model=List[schemas.Activity])
def read_activities(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return crud.get_activities(db, skip=skip, limit=limit)

# Projects
@app.get("/api/projects", response_model=List[schemas.Project])
def read_projects(db: Session = Depends(get_db)):
    return crud.get_projects(db)

# Notifications
@app.get("/api/notifications", response_model=List[schemas.Notification])
def read_notifications(db: Session = Depends(get_db)):
    return crud.get_notifications(db)

# Stock Forecast Actions
@app.post("/api/orders/expedite")
def expedite_order():
    return {"message": "Order expedited successfully. Procurement notified."}

@app.get("/api/schedule/{item_id}")
def view_schedule(item_id: int):
    return {
        "item_id": item_id,
        "schedule": [
            {"date": "2023-11-01", "event": "Batch Arrival"},
            {"date": "2023-11-05", "event": "Slab Casting Phase 1"},
            {"date": "2023-11-12", "event": "Foundation Reinforcement"}
        ]
    }

# Dev Tool
@app.post("/api/dev/reset-db")
def reset_db():
    from .seed import seed_db
    seed_db()
    return {"message": "Database reset and seeded successfully."}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
