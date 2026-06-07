import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import create_db_and_tables
from app.api.routes import auth, children, games
from app.seed_data import seed_db

_DEFAULT_ORIGINS = "http://localhost:5173,http://localhost:5174"


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    seed_db()
    yield


app = FastAPI(title="Montessori Platform API", version="0.1.0", lifespan=lifespan)

allowed_origins = os.getenv("ALLOWED_ORIGINS", _DEFAULT_ORIGINS).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(children.router, prefix="/api")
app.include_router(games.router, prefix="/api")


@app.get("/")
def root():
    return {"status": "ok", "app": "Montessori Platform"}
