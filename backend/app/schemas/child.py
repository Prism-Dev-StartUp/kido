from pydantic import BaseModel, ConfigDict
from typing import Optional


class ChildCreate(BaseModel):
    name: str
    birth_year: int
    avatar: Optional[str] = "default"


class ChildOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    birth_year: int
    avatar: str
    cycle: str
