from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas.card_report import CardStatusResponse
from app.services.card_report_service import manual_block_card, manual_unblock_card


router = APIRouter(prefix="/card_reports", tags=["Card Reports"])


@router.patch("/{card_id}/block", response_model=CardStatusResponse, status_code=status.HTTP_200_OK)
def block_card_route(card_id: int, db: Session = Depends(get_db)):
    return manual_block_card(db, card_id)



@router.patch("/{card_id}/unblock", response_model=CardStatusResponse, status_code=status.HTTP_200_OK)
def unblock_card_route(card_id: int, db: Session = Depends(get_db)):
    return manual_unblock_card(db, card_id)
