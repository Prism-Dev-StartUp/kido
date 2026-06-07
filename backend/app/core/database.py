from sqlmodel import SQLModel, create_engine, Session
from .config import settings

_connect_args = {"sslmode": "require"} if settings.database_url.startswith("postgresql") else {}
engine = create_engine(settings.database_url, echo=False, connect_args=_connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
