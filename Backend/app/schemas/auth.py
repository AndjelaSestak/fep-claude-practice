from pydantic import BaseModel, EmailStr

class VerifyOTP(BaseModel):
    email: EmailStr
    otp_code: str

class LoginRequest(BaseModel):
    email: EmailStr  # FastAPI automatski validira da je ovo email format
    password: str    

class MessageResponse(BaseModel):
    message: str
