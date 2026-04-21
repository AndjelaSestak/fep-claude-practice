from fastapi import APIRouter, BackgroundTasks, Depends, status
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.schemas.card_report import CardStatusResponse
from app.services.card_report_service import (
    manual_block_card,
    manual_unblock_card,
    report_lost_card,
    report_stolen_card,
)


router = APIRouter(prefix="/card_reports", tags=["Card Reports"])


@router.patch("/{card_id}/block", response_model=CardStatusResponse, status_code=status.HTTP_200_OK)
def block_card_route(
    card_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    return manual_block_card(db, card_id, background_tasks)


@router.patch("/{card_id}/report_lost", response_model=CardStatusResponse, status_code=status.HTTP_200_OK)
def report_lost_card_route(
    card_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    return report_lost_card(db, card_id, background_tasks)
    
@router.patch("/{card_id}/report_stolen", response_model=CardStatusResponse, status_code=status.HTTP_200_OK)
def report_stolen_card_route(
    card_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    return report_stolen_card(db, card_id, background_tasks)

@router.patch("/{card_id}/unblock", response_model=CardStatusResponse, status_code=status.HTTP_200_OK)
def unblock_card_route(
    card_id: int,
    db: Session = Depends(get_db),
):
    return manual_unblock_card(db, card_id)
