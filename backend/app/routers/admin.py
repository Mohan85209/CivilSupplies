from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import authenticate_admin, create_access_token, get_current_admin
from app.database import get_db
from app.models import AdminUser
from app.schemas import AdminLogin, AdminMeOut, TokenOut

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/login", response_model=TokenOut)
def login(payload: AdminLogin, db: Session = Depends(get_db)):
    user = authenticate_admin(db, payload.email, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token, expires_in = create_access_token(subject=user.email)
    return TokenOut(access_token=token, expires_in=expires_in)


@router.get("/me", response_model=AdminMeOut)
def me(admin: AdminUser = Depends(get_current_admin)):
    return admin
