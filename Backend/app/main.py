from contextlib import asynccontextmanager
from fastapi import FastAPI
<<<<<<< 3.2.2/ImplementLogin
from fastapi.middleware.cors import CORSMiddleware
from alembic import command
from alembic.config import Config
=======
from alembic import command
from alembic.config import Config

>>>>>>> dev
from app.routers.auth import router as auth_router
from app.utils.errors import setup_exception_handlers
from app.seed import seed

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup Logic ---
<<<<<<< 3.2.2/ImplementLogin
    alembic_cfg = Config("alembic.ini")
    
    # Wipe old data
    try:
        command.downgrade(alembic_cfg, "base")
    except Exception:
        pass  # Ignore error if tables do not exist yet on the very first run
        
    # Rebuild fresh database schema
=======
    # Load Alembic configuration from alembic.ini
    alembic_cfg = Config("alembic.ini")
    
    # Wipe old data (Keep this if you want a fresh database reset on every restart!)
    try:
        command.downgrade(alembic_cfg, "base")
    except Exception:
        pass # Ignore error if tables do not exist yet on the very first run
        
    # Rebuild a completely fresh database schema up to the latest revision
>>>>>>> dev
    command.upgrade(alembic_cfg, "head")
    
    # Insert initial mock data (seeding)
    try:
        seed()
    except Exception as e:
        print(f"Failed to seed data: {e}")
        
<<<<<<< 3.2.2/ImplementLogin
    yield 

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

=======
    # Application is ready to receive requests!
    yield 
    
    # --- Shutdown Logic ---
    # Add cleanup code here (e.g., close external API connections, connection pools)

app = FastAPI(lifespan=lifespan)

>>>>>>> dev
setup_exception_handlers(app)
app.include_router(auth_router)