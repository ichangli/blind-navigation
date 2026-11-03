import re

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user
from ..security import create_access_token, hash_password, verify_password
from ..seed import ensure_user_defaults


router = APIRouter(prefix="/api/auth", tags=["auth"])
PASSWORD_PATTERN = re.compile(r"^[A-Za-z0-9]{6,}$")


def _auth_response(user: models.User) -> schemas.AuthResponse:
    return schemas.AuthResponse(
        token=create_access_token(user.id, user.username, user.role),
        username=user.username,
        role=user.role,
    )


@router.post("/register", response_model=schemas.AuthResponse)
def register(payload: schemas.AuthRequest, db: Session = Depends(get_db)) -> schemas.AuthResponse:
    username = payload.username.strip()
    if not username:
        raise HTTPException(status_code=400, detail="Username cannot be empty")
    if username.lower() == "admin":
        raise HTTPException(status_code=400, detail="Username admin is reserved")
    if not PASSWORD_PATTERN.match(payload.password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain only letters or numbers and be at least 6 characters",
        )
    existing = db.query(models.User).filter(models.User.username == username).first()
    if existing:
        raise HTTPException(status_code=409, detail="Username already exists")

    user = models.User(username=username, password_hash=hash_password(payload.password), role="user")
    db.add(user)
    db.commit()
    db.refresh(user)
    ensure_user_defaults(db, user)
    return _auth_response(user)


@router.post("/login", response_model=schemas.AuthResponse)
def login(payload: schemas.AuthRequest, db: Session = Depends(get_db)) -> schemas.AuthResponse:
    username = payload.username.strip()
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    ensure_user_defaults(db, user)
    return _auth_response(user)


@router.get("/me")
def me(user: models.User = Depends(get_current_user)) -> dict:
    return {"username": user.username, "role": user.role}

