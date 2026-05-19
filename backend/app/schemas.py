from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


ProjectType = Literal["Residential", "Commercial", "Infrastructure", "Industrial"]
Status = Literal["new", "contacted", "closed"]


# ---------- Enquiries ----------

class EnquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    phone: str = Field(..., min_length=7, max_length=20)
    email: EmailStr
    city: str | None = Field(None, max_length=80)
    project_type: ProjectType | None = None
    materials: list[str] = Field(default_factory=list)
    quantity: str | None = Field(None, max_length=120)
    message: str | None = Field(None, max_length=2000)

    @field_validator("phone")
    @classmethod
    def clean_phone(cls, v: str) -> str:
        cleaned = "".join(c for c in v if c.isdigit() or c in "+- ")
        if len(cleaned.replace(" ", "").replace("-", "")) < 7:
            raise ValueError("Phone number is too short")
        return cleaned.strip()


class EnquiryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    phone: str
    email: EmailStr
    city: str | None
    project_type: str | None
    materials: list[str] | None
    quantity: str | None
    message: str | None
    status: str
    created_at: datetime


class EnquiryResponse(BaseModel):
    success: bool
    message: str
    enquiry_id: int


class EnquiryStatusUpdate(BaseModel):
    status: Status


# ---------- Categories ----------

class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    image_url: str | None
    sort_order: int


# ---------- Products ----------

class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    category_id: int
    brand: str | None
    unit: str | None
    description: str | None
    image_url: str | None
    is_active: bool
    created_at: datetime


class ProductListOut(BaseModel):
    items: list[ProductOut]
    total: int
    page: int
    page_size: int


# ---------- Quotes ----------

class QuoteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    phone: str
    email: EmailStr
    project_details: str | None
    site_location: str | None
    timeline: str | None
    boq_filename: str | None
    boq_file_url: str | None
    status: str
    created_at: datetime


class QuoteResponse(BaseModel):
    success: bool
    message: str
    quote_id: int


# ---------- Admin auth ----------

class AdminLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class AdminMeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    created_at: datetime
