from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from alembic import command
from alembic.config import Config
from app.routers.auth import router as auth_router
from app.utils.errors import setup_exception_handlers
from app.seed import seed

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup Logic ---
    alembic_cfg = Config("alembic.ini")
    
    # Wipe old data
    try:
        command.downgrade(alembic_cfg, "base")
    except Exception:
        pass  # Ignore error if tables do not exist yet on the very first run
        
    # Rebuild fresh database schema
    command.upgrade(alembic_cfg, "head")
    
    # Insert initial mock data (seeding)
    try:
        seed()
    except Exception as e:
        print(f"Failed to seed data: {e}")
        
    yield 

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_exception_handlers(app)
app.include_router(auth_router)