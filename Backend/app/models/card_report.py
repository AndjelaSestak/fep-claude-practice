from sqlalchemy import Integer, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
import enum
from app.database import Base

class ReportType(str, enum.Enum):
    lost = "lost"
    stolen = "stolen"
    manual_block = "manual_block"
    admin_block = "admin_block"

class CardReport(Base):
    __tablename__ = "card_reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    card_id: Mapped[int] = mapped_column(Integer, ForeignKey("cards.id"))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    report_type: Mapped[ReportType] = mapped_column(Enum(ReportType))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    card: Mapped["Card"] = relationship("Card", back_populates="card_reports")
    user: Mapped["User"] = relationship("User", back_populates="card_reports")
