from datetime import datetime
from pydantic import BaseModel, ConfigDict

from app.utils.enums import ReportType, CardStatus

class CardStatusResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: CardStatus

class CardReportRequest(BaseModel):
    report_type: ReportType
    created_at: datetime