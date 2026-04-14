from datetime import datetime, date
from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator

class UserBase(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    email: EmailStr = Field(max_length=120)

class UserCreate(UserBase):
    city: str | None = Field(default=None)
    address: str | None = Field(default=None)
    date_of_birth: date | None = Field(default=None)
    password: str = Field(min_length=8)
    confirm_password: str = Field(min_length=8)

    @model_validator(mode='after')
    def check_passwords_match(self) -> 'UserCreate':
        if self.password != self.confirm_password:
            raise ValueError('Passwords do not match')
        return self

class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_email_verified: bool
    city: str | None = Field(default=None)
    address: str | None = Field(default=None)
    date_of_birth: date | None = Field(default=None)
    created_at: datetime
    role_id: int | None = Field(default=None)

class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=50)
    city: str | None = Field(default=None)
    address: str | None = Field(default=None)
    date_of_birth: date | None = Field(default=None)
