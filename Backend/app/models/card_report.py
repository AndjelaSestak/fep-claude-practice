from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.utils.enums import ReportType


class CardReport(Base):
    __tablename__ = "card_reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    card_id: Mapped[int] = mapped_column(Integer, ForeignKey("cards.id"))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    report_type: Mapped[ReportType] = mapped_column(Enum(ReportType))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    card: Mapped["Card"] = relationship("Card", back_populates="card_reports")
    user: Mapped["User"] = relationship("User", back_populates="card_reports")
