from pydantic import BaseModel, ConfigDict

from app.models.card import CardStatus


class CardStatusResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: CardStatus
