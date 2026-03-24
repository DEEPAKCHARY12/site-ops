from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
from datetime import datetime
import shutil

from .. import crud, schemas, models
from ..database import get_db

router = APIRouter(
    prefix="/api/gallery",
    tags=["gallery"],
)

UPLOAD_DIR = "backend/static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("", response_model=schemas.GalleryResponse)
def read_gallery(
    search: Optional[str] = None,
    site_phase: Optional[str] = None,
    sort_by: str = "newest",
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1),
    db: Session = Depends(get_db)
):
    items, total = crud.get_gallery_items(
        db, search=search, site_phase=site_phase, 
        sort_by=sort_by, page=page, limit=limit
    )
    stats = crud.get_gallery_stats(db)
    
    import math
    pages = math.ceil(total / limit) if limit > 0 else 1
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages,
        "stats": stats
    }

@router.post("/upload", response_model=schemas.GalleryItem)
async def upload_image(
    title: str = Form(...),
    site_phase: str = Form(...),
    photo_category: str = Form(...),
    uploader_name: str = Form(...),
    uploader_role: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Validation
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/tiff"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Supported: JPG, PNG, GIF, TIFF.")
    
    # Size check (5MB)
    MAX_SIZE = 5 * 1024 * 1024
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max size: 5MB.")
    await file.seek(0)
    
    # Save file
    file_ext = os.path.splitext(file.filename)[1]
    file_name = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    photo_url = f"/static/uploads/{file_name}" # This assumes /static is mounted in main.py
    
    item_create = schemas.GalleryItemCreate(
        title=title,
        site_phase=site_phase,
        photo_category=photo_category,
        uploader_name=uploader_name,
        uploader_role=uploader_role,
        photo_url=photo_url
    )
    
    return crud.create_gallery_item(db=db, item=item_create)

@router.post("/share")
def share_gallery():
    # Simple mock for now
    return {"message": "Temporary shareable link generated.", "link": "https://site-ops.link/share/temp-token-123"}
