from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.utils.enums import CardStatus


class Card(Base):
    __tablename__ = "cards"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    card_type_id: Mapped[int] = mapped_column(Integer, ForeignKey("card_types.id"))
    wallet_id: Mapped[int] = mapped_column(Integer, ForeignKey("wallets.id"))
    card_number_masked: Mapped[str] = mapped_column(Text, nullable=False)
    card_pin: Mapped[str] = mapped_column(String(255), nullable=False)
    cardholder_name: Mapped[str] = mapped_column(Text, nullable=False)
    expiry_month: Mapped[int] = mapped_column(Integer, nullable=False)
    expiry_year: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[CardStatus] = mapped_column(
        Enum(CardStatus), default=CardStatus.blocked
    )
    is_email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user: Mapped["User"] = relationship("User", back_populates="cards")
    card_type: Mapped["CardType"] = relationship("CardType", back_populates="cards")
    wallet: Mapped["Wallet"] = relationship("Wallet", back_populates="cards")
    transactions: Mapped[list["Transaction"]] = relationship(
        "Transaction", back_populates="card"
    )
    card_reports: Mapped[list["CardReport"]] = relationship(
        "CardReport", back_populates="card"
    )
    transaction_templates: Mapped[list["TransactionTemplate"]] = relationship(
        "TransactionTemplate", back_populates="card"
    )
    email_verifications: Mapped[list["EmailVerification"]] = relationship(
        "EmailVerification", back_populates="card"
    )
