from contextlib import asynccontextmanager
from fastapi import FastAPI
from alembic import command
from alembic.config import Config

from app.routers.auth import router as auth_router
from app.utils.errors import setup_exception_handlers
from app.seed import seed

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup Logic ---
    # Load Alembic configuration from alembic.ini
    alembic_cfg = Config("alembic.ini")
    
    # Wipe old data (Keep this if you want a fresh database reset on every restart!)
    try:
        command.downgrade(alembic_cfg, "base")
    except Exception:
        pass # Ignore error if tables do not exist yet on the very first run
        
    # Rebuild a completely fresh database schema up to the latest revision
    command.upgrade(alembic_cfg, "head")
    
    # Insert initial mock data (seeding)
    try:
        seed()
    except Exception as e:
        print(f"Failed to seed data: {e}")
        
    # Application is ready to receive requests!
    yield 
    
    # --- Shutdown Logic ---
    # Add cleanup code here (e.g., close external API connections, connection pools)

app = FastAPI(lifespan=lifespan)

setup_exception_handlers(app)
app.include_router(auth_router)