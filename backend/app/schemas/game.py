from pydantic import BaseModel, ConfigDict
from app.models.game import Cycle


class SkillOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str
    cycle: Cycle
    icon: str


class GameOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    cycle: Cycle
    thumbnail: str
    phaser_scene_key: str
    min_age: int
    max_age: int
    difficulty: int
    skill: SkillOut


class ProgressUpdate(BaseModel):
    score: int
    completed: bool
    time_spent_seconds: int


class ProgressOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    game_id: int
    score: int
    completed: bool
    attempts: int
