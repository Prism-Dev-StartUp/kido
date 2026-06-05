from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime
from app.core.database import get_session
from app.api.deps import get_current_parent
from app.models.user import Parent, Child
from app.models.game import Cycle
from app.schemas.child import ChildCreate, ChildOut

router = APIRouter(prefix="/children", tags=["children"])


def get_cycle(birth_year: int) -> str:
    age = datetime.utcnow().year - birth_year
    if age <= 3:
        return Cycle.eveil
    elif age <= 6:
        return Cycle.maternelle
    return Cycle.primaire


@router.get("/", response_model=list[ChildOut])
def list_children(parent: Parent = Depends(get_current_parent), session: Session = Depends(get_session)):
    children = session.exec(select(Child).where(Child.parent_id == parent.id)).all()
    return [ChildOut(**c.model_dump(), cycle=get_cycle(c.birth_year)) for c in children]


@router.post("/", response_model=ChildOut, status_code=201)
def create_child(data: ChildCreate, parent: Parent = Depends(get_current_parent), session: Session = Depends(get_session)):
    child = Child(**data.model_dump(), parent_id=parent.id)
    session.add(child)
    session.commit()
    session.refresh(child)
    return ChildOut(**child.model_dump(), cycle=get_cycle(child.birth_year))


@router.delete("/{child_id}", status_code=204)
def delete_child(child_id: int, parent: Parent = Depends(get_current_parent), session: Session = Depends(get_session)):
    child = session.get(Child, child_id)
    if not child or child.parent_id != parent.id:
        raise HTTPException(404, "Child not found")
    session.delete(child)
    session.commit()
