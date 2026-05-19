from datetime import datetime
from typing import Optional, List, Literal
from pydantic import BaseModel, EmailStr, Field, field_validator


ProjectType = Literal["Residential", "Commercial", "Infrastructure", "Industrial"]


class EnquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    phone: str = Field(..., min_length=7, max_length=20)
    email: EmailStr
    city: Optional[str] = Field(None, max_length=80)
    project_type: Optional[ProjectType] = None
    materials: Optional[List[str]] = Field(default_factory=list)
    quantity: Optional[str] = Field(None, max_length=120)
    message: Optional[str] = Field(None, max_length=2000)

    @field_validator("phone")
    @classmethod
    def clean_phone(cls, v: str) -> str:
        # keep digits, +, spaces, dashes
        cleaned = "".join(c for c in v if c.isdigit() or c in "+- ")
        if len(cleaned.replace(" ", "").replace("-", "")) < 7:
            raise ValueError("Phone number is too short")
        return cleaned.strip()


class EnquiryOut(BaseModel):
    id: int
    name: str
    phone: str
    email: EmailStr
    city: Optional[str]
    project_type: Optional[str]
    materials: Optional[List[str]]
    quantity: Optional[str]
    message: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class EnquiryResponse(BaseModel):
    success: bool
    message: str
    enquiry_id: int
