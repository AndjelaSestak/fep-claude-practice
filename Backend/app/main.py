from fastapi import FastAPI
from app.routers import test


app = FastAPI(title="SecureBank API")

app.include_router(test.router)