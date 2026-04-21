from contextlib import asynccontextmanager
from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from alembic import command
from alembic.config import Config
from app.routers.transaction_router import router as transaction_router
from app.routers.auth_router import router as auth_router
from app.routers.currency_router import router as currency_router
from app.routers.user_router import router as user_router    
from app.routers.wallet_router import router as wallet_router
from app.routers.card_report_router import router as card_report_router
from alembic.config import Config 
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_exception_handlers(app)
app.include_router(auth_router)
app.include_router(currency_router)
app.include_router(user_router)
app.include_router(wallet_router)
app.include_router(card_report_router)
app.include_router(transaction_router)
