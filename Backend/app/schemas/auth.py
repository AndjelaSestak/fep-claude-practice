from pydantic import BaseModel, EmailStr, model_validator

class VerifyOTP(BaseModel):
    email: EmailStr
    otp_code: str

class LoginRequest(BaseModel):
    email: EmailStr  # FastAPI automatski validira da je ovo email format
    password: str    

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
    confirm_new_password: str

    @model_validator(mode="after")
    def check_passwords_match(self) -> "ResetPasswordRequest":
        if self.new_password != self.confirm_new_password:
            raise ValueError("Passwords do not match")
        return self