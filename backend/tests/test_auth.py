from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel.pool import StaticPool
import pytest
from app.main import app
from app.core.database import get_session

engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)


@pytest.fixture(autouse=True)
def setup_db():
    SQLModel.metadata.create_all(engine)
    yield
    SQLModel.metadata.drop_all(engine)


@pytest.fixture
def client():
    def override_session():
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_session] = override_session
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def test_register_and_login(client):
    r = client.post("/api/auth/register", json={"email": "test@test.com", "password": "pass123", "full_name": "Test"})
    assert r.status_code == 201

    r = client.post("/api/auth/login", json={"email": "test@test.com", "password": "pass123"})
    assert r.status_code == 200
    assert "access_token" in r.json()


def test_duplicate_register(client):
    client.post("/api/auth/register", json={"email": "dup@test.com", "password": "pass", "full_name": "Dup"})
    r = client.post("/api/auth/register", json={"email": "dup@test.com", "password": "pass", "full_name": "Dup"})
    assert r.status_code == 400
