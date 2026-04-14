from typing import Optional

from pydantic import ConfigDict
from pydantic_settings import BaseSettings

class Settings(BaseSettings):

    model_config = ConfigDict(extra="ignore", env_file=".env")
    DATABASE_URL: str

# JWT
    SECRET_KEY: Optional[str] = None
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Mail
    MAIL_USERNAME: Optional[str] = None
    MAIL_PASSWORD: Optional[str] = None
    MAIL_FROM: Optional[str] = None
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    
    # App
    APP_ENV: str = "development"
    DEBUG: bool = False

settings = Settings()