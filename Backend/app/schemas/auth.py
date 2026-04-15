from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr  # FastAPI automatski validira da je ovo email format
    password: str    

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"