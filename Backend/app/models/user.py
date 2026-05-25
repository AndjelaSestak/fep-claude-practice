from datetime import date, datetime, timezone
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.card import Card
    from app.models.card_report import CardReport
    from app.models.email_verification import EmailVerification
    from app.models.refresh_token import RefreshToken
    from app.models.role import Role
    from app.models.transaction import Transaction
    from app.models.transaction_template import TransactionTemplate
    from app.models.wallet import Wallet


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    email: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    is_email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    city: Mapped[str] = mapped_column(String, nullable=True)
    address: Mapped[str] = mapped_column(Text, nullable=True)
    date_of_birth: Mapped[date] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    role_id: Mapped[int] = mapped_column(Integer, ForeignKey("roles.id"), nullable=True)

    role: Mapped["Role"] = relationship("Role", back_populates="users")
    wallet: Mapped["Wallet"] = relationship(
        "Wallet", back_populates="user", uselist=False
    )
    cards: Mapped[list["Card"]] = relationship("Card", back_populates="user")
    transactions: Mapped[list["Transaction"]] = relationship(
        "Transaction", back_populates="user"
    )
    refresh_tokens: Mapped[list["RefreshToken"]] = relationship(
        "RefreshToken", back_populates="user", foreign_keys="RefreshToken.user_id"
    )
    email_verifications: Mapped[list["EmailVerification"]] = relationship(
        "EmailVerification", back_populates="user"
    )
    transaction_templates: Mapped[list["TransactionTemplate"]] = relationship(
        "TransactionTemplate", back_populates="user"
    )
    card_reports: Mapped[list["CardReport"]] = relationship(
        "CardReport", back_populates="user"
    )
