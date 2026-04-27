from datetime import datetime
from pydantic import BaseModel, ConfigDict

from app.models.card_report import ReportType
from app.models.card import CardStatus

class CardStatusResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: CardStatus

class CardReportRequest(BaseModel):
    report_type: ReportType
    created_at: datetime