from sqlalchemy import Integer, Boolean, Text, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
import enum

from app.database import Base

class VerificationPurpose(str, enum.Enum):
    registration = "registration"
    password_reset = "password_reset"
    card_verification = "card_verification"
    card_report = "card_report"
    

class EmailVerification(Base):
    __tablename__ = "email_verifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    token: Mapped[str] = mapped_column(Text, unique=True)
    purpose: Mapped[VerificationPurpose] = mapped_column(Enum(VerificationPurpose))
    expires_at: Mapped[datetime] = mapped_column(nullable=False)
    is_used: Mapped[bool] = mapped_column(Boolean, default=False)

    user: Mapped["User"] = relationship("User", back_populates="email_verifications")