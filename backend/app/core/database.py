from sqlmodel import SQLModel, create_engine, Session
from .config import settings

_url = settings.database_url
if _url.startswith("postgresql") and "sslmode" not in _url:
    _url += "?sslmode=require"

engine = create_engine(_url, echo=False)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
