from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime


class Parent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    full_name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    children: List["Child"] = Relationship(back_populates="parent")


class Child(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    avatar: str = "🧒"
    birth_year: int
    gender: Optional[str] = None          # "boy" | "girl" | "other"
    preferred_cycle: Optional[str] = None  # override auto-detection from age
    parent_id: int = Field(foreign_key="parent.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    parent: Optional[Parent] = Relationship(back_populates="children")
    progress_records: List["Progress"] = Relationship(back_populates="child")
