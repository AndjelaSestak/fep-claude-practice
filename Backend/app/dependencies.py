from typing import Generator
from app.database import SessionLocal

def get_db() -> Generator:
    """
    Creates a dedicated database session per request.
    Ensures that the session is closed after the request is finished.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
