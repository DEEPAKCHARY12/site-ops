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

# Gallery Schemas
class GalleryItemBase(BaseModel):
    title: str
    site_phase: str
    photo_category: str
    uploader_name: str
    uploader_role: str

class GalleryItemCreate(GalleryItemBase):
    photo_url: str

class GalleryItem(GalleryItemBase):
    id: int
    photo_url: str
    upload_timestamp: datetime

    class Config:
        from_attributes = True

class GalleryKPIs(BaseModel):
    totalPhotos: int
    newUploads: int
    lastUpdate: str

class GalleryResponse(BaseModel):
    items: List[GalleryItem]
    total: int
    page: int
    limit: int
    pages: int
    stats: GalleryKPIs

# Dashboard Schemas
class DashboardKPIs(BaseModel):
    total_workers: int
    critical_alerts: int
    temp: str
    wind_speed: str
    humidity: str

class InventorySummaryItem(BaseModel):
    name: str
    stock: int
    status: str
    statusColor: str
    lastDelivery: str
    icon: str

class TimelineEvent(BaseModel):
    time: str
    description: str
    status: str # current, past

class SyncHistoryItem(BaseModel):
    date: str
    timestamp: datetime
    details: str

class DailyEntryBase(BaseModel):
    date: str
    status: str

class DailyEntry(DailyEntryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Labor Schemas
class WorkerBase(BaseModel):
    worker_id_string: str
    name: str
    classification: str
    base_wage: float

class WorkerCreate(WorkerBase):
    pass

class Worker(WorkerBase):
    id: int

    class Config:
        from_attributes = True

class AttendanceUpdate(BaseModel):
    worker_id: int
    date: str
    status: str # PRESENT, HALF, ABSENT

class LaborSummary(BaseModel):
    total_crew: int
    full_day_count: int
    half_day_count: int
    total_cost: float

class WorkerAttendance(Worker):
    status: Optional[str] = "ABSENT"
    effective_pay: Optional[float] = 0.0

class PaginatedWorkers(BaseModel):
    items: List[WorkerAttendance]
    total: int
    page: int
    limit: int
    pages: int

# Report Schemas
class ReportOverview(BaseModel):
    labor_strength: int
    incidents_count: int
    weather: str

class LaborExpenditureItem(BaseModel):
    category: str
    skillLevel: str
    count: int
    dailyCost: float

class InventoryStatusItem(BaseModel):
    material: str
    inStock: str

class ReportAlertItem(BaseModel):
    type: str
    title: str
    message: str

class DailyReport(BaseModel):
    overview: ReportOverview
    labor_expenditure: List[LaborExpenditureItem]
    inventory_status: List[InventoryStatusItem]
    alerts: List[ReportAlertItem]