from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from .database import Base

class InteractionLog(Base):
    __tablename__ = "interaction_logs"

    id = Column(Integer, primary_key=True, index=True)
    element_id = Column(String, index=True)
    action_type = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    metadata_json = Column(String, nullable=True)

class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, unique=True, index=True)
    category = Column(String, index=True)
    quantity = Column(Integer, default=0)
    unit = Column(String)
    threshold = Column(Integer, default=0)
    po = Column(String, nullable=True)
    last_receipt = Column(String, nullable=True)

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    user = Column(String)
    action = Column(String)
    item = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    location = Column(String)
    type = Column(String) # consumption, arrival, po
    po_number = Column(String, nullable=True)

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    location = Column(String)
    status = Column(String)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    message = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    type = Column(String) # info, warning, critical
    is_read = Column(Boolean, default=False)

class Worker(Base):
    __tablename__ = "workers"

    id = Column(Integer, primary_key=True, index=True)
    worker_id_string = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    classification = Column(String) # Senior Mason, Helper, etc.
    base_wage = Column(Integer)

class AttendanceLog(Base):
    __tablename__ = "attendance_logs"

    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer)
    date = Column(String, index=True) # YYYY-MM-DD
    status = Column(String) # PRESENT, HALF, ABSENT
    effective_pay = Column(Integer)

class DailyEntry(Base):
    __tablename__ = "daily_entries"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, unique=True, index=True) # YYYY-MM-DD
    status = Column(String, default="OPEN") # OPEN, FINALIZED
    created_at = Column(DateTime, default=datetime.utcnow)

class SyncLog(Base):
    __tablename__ = "sync_logs"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(String)

class GalleryItem(Base):
    __tablename__ = "gallery_items"

    id = Column(Integer, primary_key=True, index=True)
    photo_url = Column(String)
    site_phase = Column(String, index=True) # Foundation, Finishing, General
    photo_category = Column(String) # For display label
    title = Column(String)
    uploader_name = Column(String)
    uploader_role = Column(String)
    upload_timestamp = Column(DateTime, default=datetime.utcnow)
