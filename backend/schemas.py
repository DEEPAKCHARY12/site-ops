from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class InteractionLogBase(BaseModel):
    element_id: str
    action_type: str
    metadata_json: Optional[str] = None

class InteractionLogCreate(InteractionLogBase):
    pass

class InteractionLog(InteractionLogBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class MaterialBase(BaseModel):
    name: str
    code: str
    category: str
    quantity: int
    unit: str
    threshold: int
    po: Optional[str] = None
    last_receipt: Optional[str] = None

class MaterialCreate(MaterialBase):
    pass

class MaterialUpdate(BaseModel):
    quantity: Optional[int] = None

class TransactionCreate(BaseModel):
    action: str  # "add" | "consume"
    quantity: int

class Material(MaterialBase):
    id: int

    class Config:
        from_attributes = True

class ActivityBase(BaseModel):
    user: str
    action: str
    item: Optional[str] = None
    location: str
    type: str
    po_number: Optional[str] = None

class ActivityCreate(ActivityBase):
    pass

class Activity(ActivityBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    name: str
    location: str
    status: str

class Project(ProjectBase):
    id: int

    class Config:
        from_attributes = True

class NotificationBase(BaseModel):
    title: str
    message: str
    type: str # info, warning, critical

class Notification(NotificationBase):
    id: int
    timestamp: datetime
    is_read: bool

    class Config:
        from_attributes = True

class InventoryStats(BaseModel):
    total_materials: int
    low_stock_alerts: int
    pending_requests: int
    monthly_usage: str

class PaginatedInventory(BaseModel):
    items: List[Material]
    total: int
    page: int
    limit: int
    pages: int