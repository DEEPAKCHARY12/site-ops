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
