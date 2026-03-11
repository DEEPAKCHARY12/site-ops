import sys
import os
from datetime import datetime, timedelta
import random

# Add parent directory to sys.path to import backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import SessionLocal, engine, Base
from backend import models

def seed_db():
    # Drop and recreate tables
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # Projects
    projects = [
        models.Project(name="Central Plaza Phase II", location="New York, NY", status="Active"),
        models.Project(name="East River Bridge Repair", location="Brooklyn, NY", status="Ongoing"),
        models.Project(name="Sector 4G Expansion", location="Chicago, IL", status="Planning"),
    ]
    db.add_all(projects)

    # Categories
    categories = ["Structural Steel", "Concrete", "Lumber", "Electrical", "Plumbing", "Fasteners", "Safety Gear"]
    units = {
        "Structural Steel": "Tons",
        "Concrete": "Bags",
        "Lumber": "m³",
        "Electrical": "m",
        "Plumbing": "Units",
        "Fasteners": "Boxes",
        "Safety Gear": "Units"
    }

    # Material names by category
    material_names = {
        "Structural Steel": ["Grade A Rebar (12mm)", "I-Beam (S235JR)", "Steel Mesh (Sector 7)", "Angle Iron (50x50)", "UPC Channel"],
        "Concrete": ["Portland Cement (Type I)", "Ready-Mix Concrete (C35)", "Self-Leveling Screed", "Rapid Set Patching", "Expanding Grout"],
        "Lumber": ["C16 Structural Timber", "Plywood (18mm)", "OSB/3 Board", "Softwood Joists", "Scaffold Boards"],
        "Electrical": ["PVC Conduit (25mm)", "Copper Wire (2.5mm)", "Circuit Breakers (32A)", "Junction Boxes", "LED Site Lights"],
        "Plumbing": ["Copper Pipe (15mm)", "PVC Drainage Pipe", "Bib Taps (Brass)", "Stopcocks", "Pipe Insulation"],
        "Fasteners": ["M12 Bolts (100mm)", "Self-Tapping Screws", "Nylon Wall Plugs", "Chemical Anchors", "Washers (M12)"],
        "Safety Gear": ["Hard Hats (BSI)", "Hi-Vis Vests", "Safety Boots (S3)", "Fall Arrest Harness", "Dust Masks (FFP3)"]
    }

    materials = []
    for cat in categories:
        for i in range(8):  # 7 categories * 8 items = 56 total
            name_base = random.choice(material_names[cat])
            name = f"{name_base} (Batch {i+1})"
            code = f"CAT-{cat[:4].upper()}-{i+1000}"
            quantity = random.randint(5, 5000)
            threshold = random.randint(50, 1500)
            
            # Ensure some are low stock
            if i < 2:
                quantity = random.randint(5, threshold - 1)
            
            materials.append(models.Material(
                name=name,
                code=code,
                category=cat,
                quantity=quantity,
                unit=units[cat],
                threshold=threshold,
                po=f"PO-{random.randint(9000, 9999)}",
                last_receipt=(datetime.now() - timedelta(days=random.randint(1, 30))).strftime("%b %d, 2023")
            ))
    db.add_all(materials)

    # Notifications
    notifications = [
        models.Notification(title="Critical Shortage", message="Sand (Coarse) level at 12%. Immediate re-order required.", type="critical"),
        models.Notification(title="Low Stock Alert", message="Curing membrane spray supply falling below safety threshold.", type="warning"),
        models.Notification(title="Delivery Update", message="PO-9945 (Steel Mesh) scheduled for arrival today at 2 PM.", type="info"),
    ]
    db.add_all(notifications)

    # Activity Data
    activities = [
        models.Activity(user="Alex Rivera", action="consumed 50kg of", item="Grade A Rebar", location="Project Area B", type="consumption"),
        models.Activity(user="Batch Arrival", action="500 bags of Portland Cement received", item="", location="Warehouse 1", type="arrival"),
        models.Activity(user="Procurement Office", action="generated for", item="Structural Steel I-Beams", location="Procurement Office", type="po", po_number="PO-9945"),
    ]
    db.add_all(activities)

    db.commit()
    print("Seed data successfully inserted.")
    db.close()

if __name__ == "__main__":
    seed_db()
