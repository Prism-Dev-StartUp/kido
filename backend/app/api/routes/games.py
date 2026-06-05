from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.core.database import get_session
from app.api.deps import get_current_parent
from app.models.user import Parent, Child
from app.models.game import Game, Cycle
from app.models.progress import Progress
from app.schemas.game import GameOut, ProgressUpdate, ProgressOut
from datetime import datetime

router = APIRouter(prefix="/games", tags=["games"])


@router.get("/", response_model=list[GameOut])
def list_games(cycle: Cycle | None = None, session: Session = Depends(get_session)):
    query = select(Game)
    if cycle:
        query = query.where(Game.cycle == cycle)
    return session.exec(query).all()


@router.get("/{game_id}", response_model=GameOut)
def get_game(game_id: int, session: Session = Depends(get_session)):
    game = session.get(Game, game_id)
    if not game:
        raise HTTPException(404, "Game not found")
    return game


@router.post("/{game_id}/progress/{child_id}", response_model=ProgressOut)
def save_progress(
    game_id: int,
    child_id: int,
    data: ProgressUpdate,
    parent: Parent = Depends(get_current_parent),
    session: Session = Depends(get_session),
):
    child = session.get(Child, child_id)
    if not child or child.parent_id != parent.id:
        raise HTTPException(403, "Forbidden")

    existing = session.exec(
        select(Progress).where(Progress.child_id == child_id, Progress.game_id == game_id)
    ).first()

    if existing:
        existing.score = max(existing.score, data.score)
        existing.completed = existing.completed or data.completed
        existing.time_spent_seconds += data.time_spent_seconds
        existing.attempts += 1
        existing.last_played_at = datetime.utcnow()
        session.add(existing)
        session.commit()
        session.refresh(existing)
        return existing

    progress = Progress(child_id=child_id, game_id=game_id, **data.model_dump())
    session.add(progress)
    session.commit()
    session.refresh(progress)
    return progress


@router.get("/progress/{child_id}", response_model=list[ProgressOut])
def get_child_progress(
    child_id: int,
    parent: Parent = Depends(get_current_parent),
    session: Session = Depends(get_session),
):
    child = session.get(Child, child_id)
    if not child or child.parent_id != parent.id:
        raise HTTPException(403, "Forbidden")
    return session.exec(select(Progress).where(Progress.child_id == child_id)).all()
