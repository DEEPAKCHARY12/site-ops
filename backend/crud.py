from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from . import models, schemas
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

# Stats
def get_inventory_stats(db: Session):
    total_materials = db.query(models.Material).count()
    low_stock_alerts = db.query(models.Material).filter(models.Material.quantity < models.Material.threshold).count()
    return schemas.InventoryStats(
        total_materials=total_materials,
        low_stock_alerts=low_stock_alerts,
        pending_requests=8,
        monthly_usage="$42.5k"
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
