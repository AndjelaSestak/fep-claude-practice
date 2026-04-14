from contextlib import asynccontextmanager
from fastapi import FastAPI
from alembic import command
from alembic.config import Config

from app.routers.auth import router as auth_router
from app.utils.errors import setup_exception_handlers
from app.seed import seed

@asynccontextmanager
async def lifespan(app: FastAPI):
    
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")

    try:
        seed()
        print("Database seeded successfully!")
    except Exception as e:
        print(f"Failed to seed data: {e}")

    yield

app = FastAPI(lifespan=lifespan)

setup_exception_handlers(app)
app.include_router(auth_router)
