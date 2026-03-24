from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from datetime import datetime
import io

from .. import crud, models, schemas
from ..database import get_db

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas
    from reportlab.lib import colors
    HAS_REPORTLAB = True
except ImportError:
    HAS_REPORTLAB = False

router = APIRouter(
    prefix="/api/reports",
    tags=["reports"],
)

def get_aggregated_report_data(db: Session, date: str):
    # Overview
    total_workers = db.query(models.AttendanceLog).filter(
        models.AttendanceLog.date == date,
        models.AttendanceLog.status.in_(["PRESENT", "HALF"])
    ).count()

    overview = schemas.ReportOverview(
        labor_strength=total_workers,
        incidents_count=0, # No incidents model
        weather="22°C Clear" # Mocked
    )

    # Labor Expenditure
    logs = db.query(models.AttendanceLog, models.Worker).join(
        models.Worker, models.AttendanceLog.worker_id == models.Worker.id
    ).filter(
        models.AttendanceLog.date == date,
        models.AttendanceLog.status.in_(["PRESENT", "HALF"])
    ).all()

    category_counts = {}
    category_costs = {}
    category_skill = {}

    for log, worker in logs:
        cat = worker.classification
        if cat not in category_counts:
            category_counts[cat] = 0
            category_costs[cat] = 0.0
            
            if "Senior" in cat or "Foreman" in cat:
                category_skill[cat] = "High"
            elif "Helper" in cat:
                category_skill[cat] = "Entry"
            else:
                category_skill[cat] = "Specialized"

        category_counts[cat] += 1
        category_costs[cat] += log.effective_pay

    labor_items = []
    for cat in category_counts:
        labor_items.append(schemas.LaborExpenditureItem(
            category=cat,
            skillLevel=category_skill[cat],
            count=category_counts[cat],
            dailyCost=category_costs[cat]
        ))

    # Inventory & Alerts
    materials = db.query(models.Material).all()
    inventory_items = []
    alerts = []
    
    for m in materials:
        inventory_items.append(schemas.InventoryStatusItem(
            material=m.name,
            inStock=f"{m.quantity} {m.unit}"
        ))

        if m.quantity <= 0:
            alerts.append(schemas.ReportAlertItem(
                type="critical",
                title="CRITICAL SHORTAGE",
                message=f"{m.name} is out of stock. Immediate re-order required."
            ))
        elif m.quantity <= m.threshold:
            alerts.append(schemas.ReportAlertItem(
                type="warning",
                title="LOW STOCK ALERT",
                message=f"{m.name} level at {m.quantity} {m.unit}. Nearing threshold of {m.threshold}."
            ))

    alerts.sort(key=lambda x: 0 if x.type == "critical" else 1)

    return schemas.DailyReport(
        overview=overview,
        labor_expenditure=labor_items,
        inventory_status=inventory_items,
        alerts=alerts
    )

@router.get("/daily", response_model=schemas.DailyReport)
def get_daily_report(date: str = None, db: Session = Depends(get_db)):
    if not date:
        date = datetime.utcnow().strftime("%Y-%m-%d")
    return get_aggregated_report_data(db, date)

@router.get("/export-pdf")
def export_pdf_report(date: str = None, db: Session = Depends(get_db)):
    if not date:
        date = datetime.utcnow().strftime("%Y-%m-%d")
        
    data = get_aggregated_report_data(db, date)
    
    if not HAS_REPORTLAB:
        raise HTTPException(status_code=500, detail="ReportLab is not installed for PDF generation.")

    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    # Simple PDF Layout
    p.setFont("Helvetica-Bold", 16)
    p.drawString(50, height - 50, f"Daily Site Report - {date}")
    
    p.setFont("Helvetica", 12)
    p.drawString(50, height - 80, f"Labor Strength: {data.overview.labor_strength}")
    p.drawString(50, height - 100, f"Reported Incidents: {data.overview.incidents_count}")
    p.drawString(50, height - 120, f"Weather Condition: {data.overview.weather}")
    
    p.setFont("Helvetica-Bold", 14)
    p.drawString(50, height - 160, "Labor Expenditure")
    
    y = height - 180
    p.setFont("Helvetica", 10)
    for item in data.labor_expenditure:
        p.drawString(50, y, f"{item.category} ({item.skillLevel}) - Count: {item.count} - Cost: ${item.dailyCost}")
        y -= 20
        
    p.setFont("Helvetica-Bold", 14)
    y -= 20
    p.drawString(50, y, "Inventory Alerts")
    
    y -= 20
    p.setFont("Helvetica", 10)
    if not data.alerts:
        p.drawString(50, y, "No alerts.")
        y -= 20
    for alert in data.alerts:
        if alert.type == "critical":
            p.setFillColor(colors.red)
        else:
            p.setFillColor(colors.orange)
        p.drawString(50, y, f"[{alert.title}] {alert.message}")
        y -= 20
    
    p.showPage()
    p.save()
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Daily_Report_{date}.pdf"}
    )
