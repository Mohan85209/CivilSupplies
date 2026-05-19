from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_admin
from app.database import get_db
from app.email_service import send_enquiry_notification
from app.models import AdminUser, Enquiry
from app.schemas import EnquiryCreate, EnquiryOut, EnquiryResponse, EnquiryStatusUpdate

router = APIRouter(prefix="/api/enquiries", tags=["enquiries"])


@router.post("", response_model=EnquiryResponse, status_code=status.HTTP_201_CREATED)
def create_enquiry(
    payload: EnquiryCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    enquiry = Enquiry(
        name=payload.name.strip(),
        phone=payload.phone,
        email=payload.email,
        city=payload.city.strip() if payload.city else None,
        project_type=payload.project_type,
        materials=payload.materials or [],
        quantity=payload.quantity,
        message=payload.message,
    )
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)

    background_tasks.add_task(send_enquiry_notification, enquiry)

    return EnquiryResponse(
        success=True,
        message="Enquiry received. Our team will contact you within 24 hours.",
        enquiry_id=enquiry.id,
    )


@router.get("", response_model=list[EnquiryOut])
def list_enquiries(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    if limit > 200:
        raise HTTPException(status_code=400, detail="limit too large")
    return (
        db.query(Enquiry)
        .order_by(Enquiry.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.patch("/{enquiry_id}", response_model=EnquiryOut)
def update_enquiry_status(
    enquiry_id: int,
    payload: EnquiryStatusUpdate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    enquiry.status = payload.status
    db.commit()
    db.refresh(enquiry)
    return enquiry
