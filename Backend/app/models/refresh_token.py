from datetime import datetime, timezone
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    token: Mapped[str] = mapped_column(String, unique=True)
    jti: Mapped[str] = mapped_column(String, unique=True)
    revoked: Mapped[bool] = mapped_column(Boolean, default=False)
    device_info: Mapped[str] = mapped_column(String, nullable=True)
    replaced_by: Mapped[int] = mapped_column(
        Integer, ForeignKey("refresh_tokens.id"), nullable=True
    )
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user: Mapped["User"] = relationship(
        "User", back_populates="refresh_tokens", foreign_keys=[user_id]
    )
