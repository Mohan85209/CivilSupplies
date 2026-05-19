from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import FileResponse, RedirectResponse
from pydantic import EmailStr
from sqlalchemy.orm import Session

from app.auth import get_current_admin
from app.config import settings
from app.database import get_db
from app.models import AdminUser, Quote
from app.schemas import QuoteOut, QuoteResponse
from app.storage import (
    is_allowed_boq,
    local_path_for,
    presigned_url_for_boq,
    save_boq,
)

router = APIRouter(prefix="/api/quotes", tags=["quotes"])


@router.post("", response_model=QuoteResponse, status_code=status.HTTP_201_CREATED)
async def create_quote(
    name: str = Form(..., min_length=2, max_length=120),
    phone: str = Form(..., min_length=7, max_length=20),
    email: EmailStr = Form(...),
    project_details: str | None = Form(None, max_length=4000),
    site_location: str | None = Form(None, max_length=200),
    timeline: str | None = Form(None, max_length=120),
    boq_file: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    storage_name: str | None = None
    file_url: str | None = None

    if boq_file is not None and boq_file.filename:
        if not is_allowed_boq(boq_file.filename):
            raise HTTPException(
                status_code=400,
                detail="BOQ file must be PDF, XLSX, or XLS",
            )
        content = await boq_file.read()
        max_bytes = settings.MAX_UPLOAD_MB * 1024 * 1024
        if len(content) > max_bytes:
            raise HTTPException(
                status_code=413,
                detail=f"BOQ file exceeds {settings.MAX_UPLOAD_MB}MB limit",
            )
        storage_name, file_url = save_boq(boq_file.filename, content)

    quote = Quote(
        name=name.strip(),
        phone=phone.strip(),
        email=email,
        project_details=project_details,
        site_location=site_location,
        timeline=timeline,
        boq_filename=storage_name,
        boq_file_url=file_url,
    )
    db.add(quote)
    db.commit()
    db.refresh(quote)

    return QuoteResponse(
        success=True,
        message="Quote request received. We'll respond within 24 hours.",
        quote_id=quote.id,
    )


@router.get("", response_model=list[QuoteOut])
def list_quotes(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    if limit > 200:
        raise HTTPException(status_code=400, detail="limit too large")
    return (
        db.query(Quote)
        .order_by(Quote.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/{quote_id}/boq")
def download_boq(
    quote_id: int,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote or not quote.boq_filename:
        raise HTTPException(status_code=404, detail="BOQ not found")

    presigned = presigned_url_for_boq(quote.boq_filename)
    if presigned:
        return RedirectResponse(url=presigned, status_code=302)

    path: Path = local_path_for(quote.boq_filename)
    if not path.exists():
        raise HTTPException(status_code=404, detail="BOQ file missing on disk")
    return FileResponse(path=str(path), filename=quote.boq_filename)
