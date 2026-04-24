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
    name: str | None = Field(default=None, max_length=50)
    city: str | None = Field(default=None)
    address: str | None = Field(default=None)
    date_of_birth: date | None = Field(default=None)

    @field_validator("name", mode="before")
    @classmethod    
    def validate_name(cls, v):
        if v is None:
            return v

        value = str(v).strip()
        if not value:
            raise ValueError("Name must be filled")
        if any(char.isdigit() for char in value):
            raise ValueError("Name cannot contain numbers")
        return value.title()
    
    @field_validator("city")
    @classmethod
    def validate_city(cls, v):
        if v is None:
            return v

        value = v.strip()
        if value and any(char.isdigit() for char in value):
            raise ValueError("City cannot contain numbers")
        return value.title() if value else None

    @field_validator("address")
    @classmethod
    def validate_address(cls, v):
        if v is None:
            return v

        value = v.strip()
        return value if value else None
    
    @field_validator("date_of_birth", mode="before")
    @classmethod
    def parse_empty_date_of_birth(cls, v):
        if v == "":
            return None
        return v

    @field_validator("date_of_birth")
    @classmethod
    def validate_date_of_birth(cls, v):
        if v is not None and v > date.today():
            raise ValueError("Date of birth cannot be in the future")
        return v

class UserPasswordUpdate(BaseModel):
    current_password: str
    new_password: str
    confirm_new_password: str

    @field_validator("current_password", "new_password", "confirm_new_password", mode="before")
    @classmethod
    def validate_password_field_not_empty(cls, v):
        if v is None or str(v).strip() == "":
            raise ValueError("All password fields are required")

        value = str(v).strip()
        if len(value) < 8:
            raise ValueError("Password fields should have at least 8 characters")
        return value

    @model_validator(mode="after")
    def check_passwords_match(self):
        if self.new_password != self.confirm_new_password:
            raise ValueError("New passwords do not match")
        return self
