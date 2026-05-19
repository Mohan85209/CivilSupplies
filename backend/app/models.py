from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON

from app.database import Base


class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    phone = Column(String(20), nullable=False, index=True)
    email = Column(String(160), nullable=False, index=True)
    city = Column(String(80), nullable=True)
    project_type = Column(String(40), nullable=True)  # Residential / Commercial / Infrastructure / Industrial
    materials = Column(JSON, nullable=True)  # list of material names
    quantity = Column(String(120), nullable=True)
    message = Column(Text, nullable=True)
    status = Column(String(20), nullable=False, default="new")  # new / contacted / closed
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
