from pydantic import BaseModel, ConfigDict
from typing import Optional


class ChildCreate(BaseModel):
    name: str
    birth_year: int
    avatar: Optional[str] = "🧒"
    gender: Optional[str] = None
    preferred_cycle: Optional[str] = None


class ChildOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    birth_year: int
    avatar: str
    gender: Optional[str]
    preferred_cycle: Optional[str]
    cycle: str  # effective cycle (preferred_cycle or auto from age)
