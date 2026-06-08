from fastapi import APIRouter, BackgroundTasks, Depends, status

from app.dependencies import get_card_report_service
from app.models.user import User
from app.schemas.card_report import CardReportRequest, CardStatusResponse
from app.services.card_report_service import CardReportService
from app.utils.permissions import AsyncRequireRole

router = APIRouter(prefix="/card_reports", tags=["Card Reports"])

require_user = AsyncRequireRole(["user"])


@router.patch(
    "/{card_id}/block",
    response_model=CardStatusResponse,
    status_code=status.HTTP_200_OK,
)
async def block_card(
    card_id: int,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(require_user),
    service: CardReportService = Depends(get_card_report_service),
):
    return await service.manual_block_card(card_id, background_tasks, current_user)


@router.patch(
    "/{card_id}/report_lost",
    response_model=CardStatusResponse,
    status_code=status.HTTP_200_OK,
)
async def report_lost_card(
    card_id: int,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(require_user),
    service: CardReportService = Depends(get_card_report_service),
):
    return await service.report_lost_card(card_id, background_tasks, current_user)


@router.patch(
    "/{card_id}/report_stolen",
    response_model=CardStatusResponse,
    status_code=status.HTTP_200_OK,
)
async def report_stolen_card(
    card_id: int,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(require_user),
    service: CardReportService = Depends(get_card_report_service),
):
    return await service.report_stolen_card(card_id, background_tasks, current_user)


@router.patch(
    "/{card_id}/unblock",
    response_model=CardStatusResponse,
    status_code=status.HTTP_200_OK,
)
async def unblock_card(
    card_id: int,
    current_user: User = Depends(require_user),
    service: CardReportService = Depends(get_card_report_service),
):
    return await service.manual_unblock_card(card_id, current_user)


@router.get(
    "/{card_id}/card_reports",
    response_model=list[CardReportRequest],
    status_code=status.HTTP_200_OK,
)
async def get_card_reports(
    card_id: int,
    current_user: User = Depends(require_user),
    service: CardReportService = Depends(get_card_report_service),
):
    return await service.get_card_reports(card_id, current_user)
