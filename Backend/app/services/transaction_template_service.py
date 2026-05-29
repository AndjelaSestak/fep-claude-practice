from sqlalchemy.exc import SQLAlchemyError

from app.models.transaction_template import TransactionTemplate
from app.models.user import User
from app.repositories.card_repository import CardRepository
from app.repositories.template_repository import TemplateRepository
from app.schemas.transaction_template import (
    TransactionTemplateCreate,
    TransactionTemplateUpdate,
)
from app.utils.enums import TransactionType
from app.utils.errors import (
    DatabaseTransactionError,
    InvalidPinError,
    TemplateExecutionError,
    TemplateNotFoundError,
)
from app.utils.security import verify_password


class TransactionTemplateService:
    def __init__(
        self,
        template_repository: TemplateRepository,
        card_repository: CardRepository,
    ) -> None:
        self.template_repository = template_repository
        self.card_repository = card_repository

    async def create_template(
        self, request: TransactionTemplateCreate, current_user: User
    ) -> TransactionTemplate:
        template = TransactionTemplate(
            user_id=current_user.id,
            name=request.name,
            type=request.type,
            amount=request.amount,
            currency=request.currency,
            recipient=request.recipient,
            recipient_account_number=request.recipient_account_number,
            card_id=request.card_id,
            reference=request.reference,
        )
        try:
            self.template_repository.add(template)
            await self.template_repository.flush()
            await self.template_repository.refresh(template)
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while creating template."
            ) from e

        return await self.template_repository.get_by_id_and_user(
            template.id, current_user.id
        )

    async def get_templates(self, current_user: User) -> list[TransactionTemplate]:
        return await self.template_repository.get_all_by_user(current_user.id)

    async def get_template_by_id(
        self, template_id: int, current_user: User
    ) -> TransactionTemplate:
        template = await self.template_repository.get_by_id_and_user(
            template_id, current_user.id
        )
        if not template:
            raise TemplateNotFoundError("Template not found")
        return template

    async def update_template(
        self, template_id: int, request: TransactionTemplateUpdate, current_user: User
    ) -> TransactionTemplate:
        template = await self.get_template_by_id(template_id, current_user)

        TEMPLATE_FIELDS = {
            "name",
            "amount",
            "currency",
            "recipient",
            "recipient_account_number",
            "card_id",
            "reference",
        }

        update_data = request.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            if key in TEMPLATE_FIELDS:
                setattr(template, key, value)

        try:
            await self.template_repository.flush()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "Failed to update template due to a database error."
            ) from e

        return await self.template_repository.get_by_id_and_user(
            template.id, current_user.id
        )

    async def delete_template(self, template_id: int, current_user: User) -> None:
        template = await self.get_template_by_id(template_id, current_user)
        for recurring in template.recurring_transactions:
            if recurring.is_active:
                recurring.is_active = False
        template.is_deleted = True
        try:
            await self.template_repository.flush()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while deleting template."
            ) from e

    async def validate_execute(
        self, template_id: int, current_user: User, pin: str
    ) -> TransactionTemplate:
        template = await self.get_template_by_id(template_id, current_user)

        if template.type == TransactionType.recurring:
            raise TemplateExecutionError(
                "Recurring templates are executed automatically via scheduler."
            )

        card = await self.card_repository.get_by_id_and_user(
            template.card_id, current_user.id
        )
        if not card or not verify_password(pin, card.card_pin):
            raise InvalidPinError("Incorrect PIN")

        return template
