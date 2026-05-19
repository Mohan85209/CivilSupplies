"""Idempotent seed script.

Run from the backend/ directory:
    python scripts/seed.py
"""
from __future__ import annotations

import sys
from pathlib import Path

# Allow running this script directly from backend/.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.auth import hash_password  # noqa: E402
from app.config import settings  # noqa: E402
from app.database import Base, SessionLocal, engine  # noqa: E402
from app.models import AdminUser, Category, Product  # noqa: E402


CATEGORIES = [
    {"name": "Cement", "slug": "cement", "sort_order": 1},
    {"name": "TMT Steel", "slug": "tmt-steel", "sort_order": 2},
    {"name": "Bricks & Blocks", "slug": "bricks-blocks", "sort_order": 3},
    {"name": "Aggregates", "slug": "aggregates", "sort_order": 4},
    {"name": "Tools & Safety", "slug": "tools-safety", "sort_order": 5},
]

PRODUCTS = [
    # Cement
    {"name": "OPC 53 Grade Cement", "slug": "opc-53-grade-cement", "category": "cement",
     "brand": "UltraTech", "unit": "50 kg bag",
     "description": "High-strength Ordinary Portland Cement, 53 grade. Ideal for RCC structural work."},
    {"name": "PPC Cement", "slug": "ppc-cement", "category": "cement",
     "brand": "Ambuja", "unit": "50 kg bag",
     "description": "Portland Pozzolana Cement for general construction. Good workability, durable in aggressive environments."},
    {"name": "PSC Cement", "slug": "psc-cement", "category": "cement",
     "brand": "ACC", "unit": "50 kg bag",
     "description": "Portland Slag Cement, suited for mass concrete and marine works."},

    # TMT Steel
    {"name": "TMT Fe 500 Steel Bars - 8mm", "slug": "tmt-fe500-8mm", "category": "tmt-steel",
     "brand": "TATA Tiscon", "unit": "per ton",
     "description": "Fe 500 grade thermo-mechanically treated steel bars, 8mm diameter."},
    {"name": "TMT Fe 500 Steel Bars - 12mm", "slug": "tmt-fe500-12mm", "category": "tmt-steel",
     "brand": "JSW Neosteel", "unit": "per ton",
     "description": "Fe 500 grade TMT, 12mm. Standard for slab and beam reinforcement."},
    {"name": "TMT Fe 500D Steel Bars - 16mm", "slug": "tmt-fe500d-16mm", "category": "tmt-steel",
     "brand": "TATA Tiscon", "unit": "per ton",
     "description": "Fe 500D high-ductility TMT, 16mm. Suited for seismic zones."},

    # Bricks & Blocks
    {"name": "Red Clay Bricks", "slug": "red-clay-bricks", "category": "bricks-blocks",
     "brand": "Local Premium", "unit": "per 1000",
     "description": "Standard-size first-class red clay bricks (230 x 110 x 75 mm)."},
    {"name": "AAC Blocks 600x200x150", "slug": "aac-blocks-600x200x150", "category": "bricks-blocks",
     "brand": "Magicrete", "unit": "per cubic meter",
     "description": "Autoclaved Aerated Concrete blocks. Lightweight, thermal-insulating."},
    {"name": "Solid Concrete Blocks", "slug": "solid-concrete-blocks", "category": "bricks-blocks",
     "brand": "Local", "unit": "per piece",
     "description": "Heavy-duty solid concrete blocks, 400x200x200 mm."},

    # Aggregates
    {"name": "M-Sand (Manufactured Sand)", "slug": "m-sand", "category": "aggregates",
     "brand": "Robo Silicon", "unit": "per cubic meter",
     "description": "Plastering and concreting grade manufactured sand, zone-II."},
    {"name": "20mm Aggregate", "slug": "20mm-aggregate", "category": "aggregates",
     "brand": "Local Quarry", "unit": "per cubic meter",
     "description": "Crushed stone aggregate 20mm, ideal for RCC concrete."},
    {"name": "40mm Aggregate", "slug": "40mm-aggregate", "category": "aggregates",
     "brand": "Local Quarry", "unit": "per cubic meter",
     "description": "Crushed stone aggregate 40mm, for PCC and foundation."},

    # Tools & Safety
    {"name": "Safety Helmet (ISI marked)", "slug": "safety-helmet-isi", "category": "tools-safety",
     "brand": "Karam", "unit": "per piece",
     "description": "ISI marked construction safety helmet with adjustable harness."},
    {"name": "Safety Boots Steel Toe", "slug": "safety-boots-steel-toe", "category": "tools-safety",
     "brand": "Allen Cooper", "unit": "per pair",
     "description": "Steel-toe leather safety boots for site workers."},
    {"name": "Vibrating Compactor (Rental)", "slug": "vibrating-compactor-rental", "category": "tools-safety",
     "brand": "Honda", "unit": "per day",
     "description": "Plate compactor for soil and asphalt compaction. Daily rental."},
]


def run() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Categories
        slug_to_id: dict[str, int] = {}
        for c in CATEGORIES:
            existing = db.query(Category).filter(Category.slug == c["slug"]).first()
            if existing:
                slug_to_id[c["slug"]] = existing.id
                continue
            cat = Category(name=c["name"], slug=c["slug"], sort_order=c["sort_order"])
            db.add(cat)
            db.flush()
            slug_to_id[c["slug"]] = cat.id
        print(f"Categories: {len(slug_to_id)} total")

        # Products
        new_products = 0
        for p in PRODUCTS:
            existing = db.query(Product).filter(Product.slug == p["slug"]).first()
            if existing:
                continue
            db.add(Product(
                name=p["name"],
                slug=p["slug"],
                category_id=slug_to_id[p["category"]],
                brand=p["brand"],
                unit=p["unit"],
                description=p["description"],
                is_active=True,
            ))
            new_products += 1
        print(f"Products: {new_products} created (out of {len(PRODUCTS)})")

        # Admin user
        admin_email = settings.SEED_ADMIN_EMAIL
        admin = db.query(AdminUser).filter(AdminUser.email == admin_email).first()
        if not admin:
            db.add(AdminUser(
                email=admin_email,
                password_hash=hash_password(settings.SEED_ADMIN_PASSWORD),
            ))
            print(f"Admin user created: {admin_email}")
        else:
            print(f"Admin user already exists: {admin_email}")

        db.commit()
        print("Seed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    run()
