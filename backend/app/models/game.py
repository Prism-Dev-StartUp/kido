from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from enum import Enum


class Cycle(str, Enum):
    eveil = "eveil"          # 0-3 ans
    maternelle = "maternelle"  # 3-6 ans
    primaire = "primaire"    # 6-12 ans


class Skill(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    cycle: Cycle
    icon: str = ""

    games: List["Game"] = Relationship(back_populates="skill")


class Game(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    cycle: Cycle
    skill_id: int = Field(foreign_key="skill.id")
    thumbnail: str = ""
    phaser_scene_key: str  # maps to a Phaser scene class name in frontend
    min_age: int
    max_age: int
    difficulty: int = Field(ge=1, le=3, default=1)  # 1=easy, 2=medium, 3=hard

    skill: Optional[Skill] = Relationship(back_populates="games")
    progress_records: List["Progress"] = Relationship(back_populates="game")
