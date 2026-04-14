from fastapi import FastAPI
from app.routers.auth import router as auth_router
from app.utils.errors import setup_exception_handlers
from app.database import engine, Base, SessionLocal
from app.seed import seed

app = FastAPI()

setup_exception_handlers(app)

app.include_router(auth_router)

@app.on_event("startup")
def startup_event():

    Base.metadata.drop_all(bind=engine)
    # Creating tables if they do not exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        seed()
    finally:
        db.close()