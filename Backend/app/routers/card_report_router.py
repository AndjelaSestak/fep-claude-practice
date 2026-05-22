from fastapi import APIRouter, BackgroundTasks, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.card_report import CardReportRequest, CardStatusResponse
from app.utils.permissions import RequireRole
from app.models.user import User
from app.services.card_report_service import (
    manual_block_card,
    manual_unblock_card,
    report_lost_card,
    report_stolen_card,
    get_card_reports,
)


router = APIRouter(prefix="/card_reports", tags=["Card Reports"])


require_user = RequireRole([ "user"])

@router.patch("/{card_id}/block", response_model=CardStatusResponse, status_code=status.HTTP_200_OK)
def block_card_route(
    card_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user)
):
    return manual_block_card(db, card_id, background_tasks,current_user=current_user)


@router.patch("/{card_id}/report_lost", response_model=CardStatusResponse, status_code=status.HTTP_200_OK)
def report_lost_card_route(
    card_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user)
):
    return report_lost_card(db, card_id, background_tasks,current_user=current_user)
    
@router.patch("/{card_id}/report_stolen", response_model=CardStatusResponse, status_code=status.HTTP_200_OK)
def report_stolen_card_route(
    card_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user)
):
    return report_stolen_card(db, card_id, background_tasks,current_user=current_user)

@router.patch("/{card_id}/unblock", response_model=CardStatusResponse, status_code=status.HTTP_200_OK)
def unblock_card_route(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user)
):
    return manual_unblock_card(db, card_id,current_user=current_user)

@router.get("/{card_id}/card_reports", response_model=list[CardReportRequest], status_code=status.HTTP_200_OK)
def get_card_reports_route(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user)
):
    return get_card_reports(db, card_id,current_user=current_user)
