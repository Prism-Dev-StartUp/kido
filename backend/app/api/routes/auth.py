from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.core.database import get_session
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import Parent
from app.schemas.auth import ParentRegister, ParentLogin, Token, ParentOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=ParentOut, status_code=status.HTTP_201_CREATED)
def register(data: ParentRegister, session: Session = Depends(get_session)):
    if session.exec(select(Parent).where(Parent.email == data.email)).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    parent = Parent(
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
    )
    session.add(parent)
    session.commit()
    session.refresh(parent)
    return parent


@router.post("/login", response_model=Token)
def login(data: ParentLogin, session: Session = Depends(get_session)):
    parent = session.exec(select(Parent).where(Parent.email == data.email)).first()
    if not parent or not verify_password(data.password, parent.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(parent.id)})
    return Token(access_token=token)
