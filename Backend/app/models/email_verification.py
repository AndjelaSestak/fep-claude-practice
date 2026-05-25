from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.utils.enums import VerificationPurpose

if TYPE_CHECKING:
    from app.models.card import Card
    from app.models.user import User


class EmailVerification(Base):
    __tablename__ = "email_verifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    card_id: Mapped[int] = mapped_column(Integer, ForeignKey("cards.id"), nullable=True)
    token: Mapped[str] = mapped_column(Text, unique=True)
    purpose: Mapped[VerificationPurpose] = mapped_column(Enum(VerificationPurpose))
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    is_used: Mapped[bool] = mapped_column(Boolean, default=False)

    user: Mapped["User"] = relationship("User", back_populates="email_verifications")
    card: Mapped["Card"] = relationship("Card", back_populates="email_verifications")
