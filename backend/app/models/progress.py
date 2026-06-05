from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime


class Progress(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    child_id: int = Field(foreign_key="child.id")
    game_id: int = Field(foreign_key="game.id")
    score: int = 0
    completed: bool = False
    time_spent_seconds: int = 0
    attempts: int = 1
    last_played_at: datetime = Field(default_factory=datetime.utcnow)

    child: Optional["Child"] = Relationship(back_populates="progress_records")
    game: Optional["Game"] = Relationship(back_populates="progress_records")
