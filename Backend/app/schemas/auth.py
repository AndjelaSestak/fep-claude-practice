from pydantic import BaseModel, EmailStr

class VerifyOTP(BaseModel):
    email: EmailStr
    otp_code: str