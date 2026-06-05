from pydantic import BaseModel, EmailStr


class ParentRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class ParentLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ParentOut(BaseModel):
    id: int
    email: str
    full_name: str
