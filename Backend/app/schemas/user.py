from datetime import datetime, date
from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator, field_validator

class UserBase(BaseModel):
    name: str = Field(max_length=50)
    email: EmailStr

    @field_validator("name")
    @classmethod
    def validate_name(cls, v):
        if not v or not v.strip():
            raise ValueError("Name is required")
        return v.strip().title()

    @field_validator("email", mode="before")
    @classmethod
    def validate_email(cls, v):
        if v is None or str(v).strip() == "":
            raise ValueError("Email is required")
        return v.lower().strip()

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

class UserPasswordUpdate(BaseModel):
    current_password: str = Field(min_length=8)
    new_password: str = Field(min_length=8)
    confirm_new_password: str = Field(min_length=8)

    @model_validator(mode='after')
    def check_passwords_match(self):
        if self.new_password != self.confirm_new_password:
            raise ValueError("New passwords do not match")

        return self
