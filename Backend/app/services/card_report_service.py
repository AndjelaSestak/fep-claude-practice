from collections.abc import Sequence

from fastapi import BackgroundTasks

from app.models.card import Card, CardStatus
from app.models.card_report import CardReport
from app.models.user import User
from app.repositories.card_report_repository import CardReportRepository
from app.repositories.card_repository import CardRepository
from app.services.email_service import email_service
from app.utils.enums import ReportType
from app.utils.errors import BadRequestError, CardNotFoundError


class CardReportService:
    def __init__(
        self,
        card_repository: CardRepository,
        card_report_repository: CardReportRepository,
    ) -> None:
        self.card_repository = card_repository
        self.card_report_repository = card_report_repository

    async def _report_and_block_card(
        self,
        card_id: int,
        background_tasks: BackgroundTasks,
        report_type: ReportType,
        new_status: CardStatus,
        current_user: User,
    ) -> Card:
        card = await self.card_repository.get_by_id_and_user(card_id, current_user.id)
        if not card:
            raise CardNotFoundError("Card not found")

        if card.status != CardStatus.active:
            raise BadRequestError("Only active cards can be reported or blocked")

        card.status = new_status

        card_report = CardReport(
            card_id=card.id,
            user_id=card.user_id,
            report_type=report_type,
        )
        self.card_report_repository.add(card_report)

        background_tasks.add_task(
            email_service.send_card_block_notification,
            recipient=current_user.email,
            name=current_user.name,
            card_last_four=card.card_number_masked[-4:]
            if card.card_number_masked
            else "****",
            reason=report_type.value,
        )

        return card

    async def manual_block_card(
        self,
        card_id: int,
        background_tasks: BackgroundTasks,
        current_user: User,
    ) -> Card:
        return await self._report_and_block_card(
            card_id=card_id,
            background_tasks=background_tasks,
            report_type=ReportType.manual_block,
            new_status=CardStatus.blocked,
            current_user=current_user,
        )

    async def report_lost_card(
        self,
        card_id: int,
        background_tasks: BackgroundTasks,
        current_user: User,
    ) -> Card:
        return await self._report_and_block_card(
            card_id=card_id,
            background_tasks=background_tasks,
            report_type=ReportType.lost,
            new_status=CardStatus.reported_lost,
            current_user=current_user,
        )

    async def report_stolen_card(
        self,
        card_id: int,
        background_tasks: BackgroundTasks,
        current_user: User,
    ) -> Card:
        return await self._report_and_block_card(
            card_id=card_id,
            background_tasks=background_tasks,
            report_type=ReportType.stolen,
            new_status=CardStatus.reported_stolen,
            current_user=current_user,
        )

    async def manual_unblock_card(
        self,
        card_id: int,
        current_user: User,
    ) -> Card:
        card = await self.card_repository.get_by_id_and_user(card_id, current_user.id)
        if not card:
            raise CardNotFoundError("Card not found")

        if card.status == CardStatus.active:
            raise BadRequestError("Card is already active")

        card.status = CardStatus.active
        return card

    async def get_card_reports(
        self,
        card_id: int,
        current_user: User,
    ) -> Sequence[CardReport]:
        card = await self.card_repository.get_by_id_and_user(card_id, current_user.id)
        if not card:
            raise CardNotFoundError("Card not found")

        if not card.is_email_verified:
            raise BadRequestError("Card not found")

        return await self.card_report_repository.get_by_card_id(card_id)
