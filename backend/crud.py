from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from . import models, schemas
from typing import Optional, List
from datetime import datetime
import random
import csv
import io

# InteractionLog CRUD
def create_interaction_log(db: Session, interaction: schemas.InteractionLogCreate):
    db_interaction = models.InteractionLog(
        element_id=interaction.element_id,
        action_type=interaction.action_type,
        metadata_json=interaction.metadata_json
    )
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

def get_interaction_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.InteractionLog).offset(skip).limit(limit).all()

# Material CRUD
def get_inventory(
    db: Session, 
    search: str = None, 
    category: str = None, 
    status: str = None,
    sort_by: str = "name",
    order: str = "asc",
    page: int = 1, 
    limit: int = 10
):
    query = db.query(models.Material)

    if search:
        query = query.filter(
            or_(
                models.Material.name.ilike(f"%{search}%"),
                models.Material.code.ilike(f"%{search}%"),
                models.Material.po.ilike(f"%{search}%")
            )
        )
    
    if category and category != "All Materials":
        query = query.filter(models.Material.category == category)
    
    if status and status != "Status: All":
        if "Low Stock" in status:
            query = query.filter(models.Material.quantity < models.Material.threshold)
        elif "In Stock" in status:
            query = query.filter(models.Material.quantity >= models.Material.threshold)

    # Sorting
    if hasattr(models.Material, sort_by):
        col = getattr(models.Material, sort_by)
        if order == "desc":
            query = query.order_by(desc(col))
        else:
            query = query.order_by(asc(col))
    
    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()
    
    return items, total

def get_material_by_code(db: Session, code: str):
    return db.query(models.Material).filter(models.Material.code == code).first()

def create_material(db: Session, material: schemas.MaterialCreate):
    db_material = models.Material(**material.dict())
    db.add(db_material)
    db.commit()
    db.refresh(db_material)
    return db_material

def adjust_material_quantity(db: Session, item_id: int, adjustment: int):
    db_material = db.query(models.Material).filter(models.Material.id == item_id).first()
    if db_material:
        db_material.quantity += adjustment
        db.commit()
        db.refresh(db_material)
    return db_material

# Activity CRUD
def get_activities(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Activity).order_by(models.Activity.timestamp.desc()).offset(skip).limit(limit).all()

def create_activity(db: Session, activity: schemas.ActivityCreate):
    db_activity = models.Activity(**activity.dict())
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

def delete_material(db: Session, item_id: int):
    db_material = db.query(models.Material).filter(models.Material.id == item_id).first()
    if db_material:
        db.delete(db_material)
        db.commit()
    return db_material

def create_transaction(db: Session, item_id: int, transaction: schemas.TransactionCreate):
    db_material = db.query(models.Material).filter(models.Material.id == item_id).first()
    if not db_material:
        return None
    
    adjustment = transaction.quantity
    if transaction.action == "consume":
        adjustment = -abs(adjustment)
    else:
        adjustment = abs(adjustment)
        
    db_material.quantity += adjustment
    db.commit()
    db.refresh(db_material)
    
    # Create single activity entry for the bulk transaction
    action_text = "consumed" if transaction.action == "consume" else "added"
    activity = schemas.ActivityCreate(
        user="User",
        action=f"{action_text} {abs(adjustment)} {db_material.unit} of",
        item=db_material.name,
        location="Project Area B",
        type="consumption" if transaction.action == "consume" else "arrival"
    )
    create_activity(db=db, activity=activity)
    
    return db_material

# Stats
def get_inventory_stats(db: Session):
    total_materials = db.query(models.Material).count()
    low_stock_alerts = db.query(models.Material).filter(models.Material.quantity < models.Material.threshold).count()
    # Mocking some values for now as per original
    return schemas.InventoryStats(
        total_materials=total_materials,
        low_stock_alerts=low_stock_alerts,
        pending_requests=random.randint(5, 15),
        monthly_usage=f"${random.randint(30, 60)}k"
    )

# Projects
def get_projects(db: Session):
    return db.query(models.Project).all()

# Notifications
def get_notifications(db: Session, skip: int = 0, limit: int = 5):
    return db.query(models.Notification).order_by(models.Notification.timestamp.desc()).offset(skip).limit(limit).all()

# CSV Export
def export_inventory_csv(db: Session):
    items = db.query(models.Material).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Name", "Code", "Category", "Quantity", "Unit", "Threshold", "PO", "Last Receipt"])
    for item in items:
        writer.writerow([item.id, item.name, item.code, item.category, item.quantity, item.unit, item.threshold, item.po, item.last_receipt])
    return output.getvalue()

# Labor CRUD
def get_workers(db: Session, page: int = 1, limit: int = 10, date: str = None):
    query = db.query(models.Worker)
    total = query.count()
    workers = query.offset((page - 1) * limit).limit(limit).all()
    
    result = []
    for worker in workers:
        attendance = db.query(models.AttendanceLog).filter(
            models.AttendanceLog.worker_id == worker.id,
            models.AttendanceLog.date == date
        ).first()
        
        result.append(schemas.WorkerAttendance(
            id=worker.id,
            worker_id_string=worker.worker_id_string,
            name=worker.name,
            classification=worker.classification,
            base_wage=float(worker.base_wage),
            status=attendance.status if attendance else "ABSENT",
            effective_pay=float(attendance.effective_pay) if attendance else 0.0
        ))
    
    return result, total

def create_worker(db: Session, worker: schemas.WorkerCreate):
    db_worker = models.Worker(**worker.dict())
    db.add(db_worker)
    db.commit()
    db.refresh(db_worker)
    return db_worker

def delete_worker(db: Session, worker_id: int):
    db_worker = db.query(models.Worker).filter(models.Worker.id == worker_id).first()
    if db_worker:
        db.delete(db_worker)
        db.commit()
    return db_worker

def update_attendance(db: Session, attendance: schemas.AttendanceUpdate):
    db_worker = db.query(models.Worker).filter(models.Worker.id == attendance.worker_id).first()
    if not db_worker:
        return None
    
    # Calculate effective pay
    factor = 0.0
    if attendance.status == "PRESENT":
        factor = 1.0
    elif attendance.status == "HALF":
        factor = 0.5
    
    effective_pay = db_worker.base_wage * factor
    
    db_attendance = db.query(models.AttendanceLog).filter(
        models.AttendanceLog.worker_id == attendance.worker_id,
        models.AttendanceLog.date == attendance.date
    ).first()
    
    if db_attendance:
        db_attendance.status = attendance.status
        db_attendance.effective_pay = int(effective_pay)
    else:
        db_attendance = models.AttendanceLog(
            worker_id=attendance.worker_id,
            date=attendance.date,
            status=attendance.status,
            effective_pay=int(effective_pay)
        )
        db.add(db_attendance)
    
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

def get_labor_summary(db: Session, date: str):
    logs = db.query(models.AttendanceLog).filter(models.AttendanceLog.date == date).all()
    
    total_crew = len([l for l in logs if l.status in ["PRESENT", "HALF"]])
    full_day_count = len([l for l in logs if l.status == "PRESENT"])
    half_day_count = len([l for l in logs if l.status == "HALF"])
    total_cost = sum([l.effective_pay for l in logs])
    
    return schemas.LaborSummary(
        total_crew=total_crew,
        full_day_count=full_day_count,
        half_day_count=half_day_count,
        total_cost=float(total_cost)
    )

# Dashboard CRUD
def get_dashboard_kpis(db: Session, date: str):
    # Total workers present today
    total_workers = db.query(models.AttendanceLog).filter(
        models.AttendanceLog.date == date,
        models.AttendanceLog.status.in_(["PRESENT", "HALF"])
    ).count()

    # Critical stock alerts
    critical_alerts = db.query(models.Material).filter(
        models.Material.quantity <= models.Material.threshold
    ).count()

    # Mock weather for now
    return schemas.DashboardKPIs(
        total_workers=total_workers,
        critical_alerts=critical_alerts,
        temp="24°C",
        wind_speed="12 km/h",
        humidity="62%"
    )

def get_dashboard_inventory_summary(db: Session):
    # Return top 5 items, prioritized by low stock
    materials = db.query(models.Material).order_by(
        (models.Material.quantity - models.Material.threshold).asc()
    ).limit(5).all()

    result = []
    for m in materials:
        status = "HEALTHY"
        statusColor = "emerald"
        if m.quantity <= 0:
            status = "OUT OF STOCK"
            statusColor = "red"
        elif m.quantity <= m.threshold:
            status = "LOW STOCK"
            statusColor = "amber"

        result.append(schemas.InventorySummaryItem(
            name=m.name,
            stock=m.quantity,
            status=status,
            statusColor=statusColor,
            lastDelivery=m.last_receipt or "N/A",
            icon="layers" # Default icon
        ))
    return result

def get_sync_history(db: Session):
    return db.query(models.SyncLog).order_by(models.SyncLog.timestamp.desc()).limit(10).all()

def create_daily_entry(db: Session, date: str):
    db_entry = db.query(models.DailyEntry).filter(models.DailyEntry.date == date).first()
    if not db_entry:
        db_entry = models.DailyEntry(date=date, status="OPEN")
        db.add(db_entry)
        db.commit()
        db.refresh(db_entry)
    return db_entry

def finalize_day(db: Session, date: str):
    db_entry = db.query(models.DailyEntry).filter(models.DailyEntry.date == date).first()
    if db_entry:
        db_entry.status = "FINALIZED"
        
        # Create sync log
        sync_log = models.SyncLog(
            date=date,
            details=f"Finalized and synced logs for {date}."
        )
        db.add(sync_log)
        db.commit()
    return db_entry

# Gallery Operations
def get_gallery_items(
    db: Session, 
    search: Optional[str] = None, 
    site_phase: Optional[str] = None, 
    sort_by: str = "newest",
    page: int = 1,
    limit: int = 20
):
    query = db.query(models.GalleryItem)
    
    if search:
        query = query.filter(models.GalleryItem.title.ilike(f"%{search}%"))
    
    if site_phase and site_phase != "All":
        query = query.filter(models.GalleryItem.site_phase == site_phase)
    
    if sort_by == "oldest":
        query = query.order_by(models.GalleryItem.upload_timestamp.asc())
    else:
        query = query.order_by(models.GalleryItem.upload_timestamp.desc())
    
    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()
    
    return items, total

def create_gallery_item(db: Session, item: schemas.GalleryItemCreate):
    db_item = models.GalleryItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_gallery_stats(db: Session):
    total_photos = db.query(models.GalleryItem).count()
    
    # New uploads today
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    new_uploads = db.query(models.GalleryItem).filter(models.GalleryItem.upload_timestamp >= today_start).count()
    
    # Last update timestamp
    last_item = db.query(models.GalleryItem).order_by(models.GalleryItem.upload_timestamp.desc()).first()
    last_update = last_item.upload_timestamp.strftime("%I:%M %p") if last_item else "--:--"
    
    return {
        "totalPhotos": total_photos,
        "newUploads": new_uploads,
        "lastUpdate": last_update
    }
