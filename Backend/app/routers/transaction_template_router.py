from fastapi import APIRouter, BackgroundTasks, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_db
from app.models.user import User
from app.repositories.card_repository import CardRepository
from app.repositories.recurring_transaction_repository import (
    RecurringTransactionRepository,
)
from app.repositories.template_repository import TemplateRepository
from app.repositories.transaction_repository import TransactionRepository
from app.repositories.wallet_repository import WalletRepository
from app.schemas.recurring_transaction import RecurringTransactionUpdate
from app.schemas.transaction import CreateTransactionRequest
from app.schemas.transaction_template import (
    ExecuteTemplateRequest,
    TransactionTemplateCreate,
    TransactionTemplateResponse,
    TransactionTemplateUpdate,
)
from app.services.recurring_transaction_service import RecurringTransactionService
from app.services.transaction_service import TransactionService
from app.services.transaction_template_service import TransactionTemplateService
from app.utils.enums import TransactionType
from app.utils.permissions import AsyncRequireRole

router = APIRouter(prefix="/templates", tags=["Transaction Templates"])

require_user = AsyncRequireRole(["user"])


def get_template_service(
    db: AsyncSession = Depends(get_async_db),
) -> TransactionTemplateService:
    return TransactionTemplateService(
        template_repository=TemplateRepository(db),
        card_repository=CardRepository(db),
    )


def get_transaction_service(
    db: AsyncSession = Depends(get_async_db),
) -> TransactionService:
    return TransactionService(
        transaction_repository=TransactionRepository(db),
        wallet_repository=WalletRepository(db),
        card_repository=CardRepository(db),
    )


def get_recurring_service(
    db: AsyncSession = Depends(get_async_db),
) -> RecurringTransactionService:
    return RecurringTransactionService(
        recurring_transaction_repository=RecurringTransactionRepository(db),
        transaction_repository=TransactionRepository(db),
        wallet_repository=WalletRepository(db),
        card_repository=CardRepository(db),
    )


@router.post(
    "", response_model=TransactionTemplateResponse, status_code=status.HTTP_201_CREATED
)
async def create_template(
    request: TransactionTemplateCreate,
    current_user: User = Depends(require_user),
    template_service: TransactionTemplateService = Depends(get_template_service),
    recurring_service: RecurringTransactionService = Depends(get_recurring_service),
):
    template = await template_service.create_template(request, current_user)

    if template.type == TransactionType.recurring:
        await recurring_service.create_recurring_transaction(
            template=template,
            frequency=request.frequency,
            start_date=request.start_date,
            end_date=request.end_date,
        )
    return template


@router.get("", response_model=list[TransactionTemplateResponse])
async def get_all_templates(
    current_user: User = Depends(require_user),
    service: TransactionTemplateService = Depends(get_template_service),
):
    return await service.get_templates(current_user)


@router.get("/{template_id}", response_model=TransactionTemplateResponse)
async def get_template(
    template_id: int,
    current_user: User = Depends(require_user),
    service: TransactionTemplateService = Depends(get_template_service),
):
    return await service.get_template_by_id(template_id, current_user)


@router.put("/{template_id}", response_model=TransactionTemplateResponse)
async def update_template(
    template_id: int,
    request: TransactionTemplateUpdate,
    current_user: User = Depends(require_user),
    template_service: TransactionTemplateService = Depends(get_template_service),
    recurring_service: RecurringTransactionService = Depends(get_recurring_service),
):
    template = await template_service.update_template(
        template_id, request, current_user
    )

    RECURRING_FIELDS = {"frequency", "start_date", "end_date"}
    update_data = request.model_dump(exclude_unset=True)
    recurring_update = {k: v for k, v in update_data.items() if k in RECURRING_FIELDS}

    if template.type == TransactionType.recurring and recurring_update:
        await recurring_service.update_for_template(
            template=template,
            request=RecurringTransactionUpdate(**recurring_update),
            current_user=current_user,
        )

    return template


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(
    template_id: int,
    current_user: User = Depends(require_user),
    service: TransactionTemplateService = Depends(get_template_service),
):
    await service.delete_template(template_id, current_user)


@router.post("/{template_id}/execute", status_code=status.HTTP_201_CREATED)
async def execute_template(
    template_id: int,
    data: ExecuteTemplateRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(require_user),
    transaction_template_service: TransactionTemplateService = Depends(
        get_template_service
    ),
    transaction_service: TransactionService = Depends(get_transaction_service),
):
    template = await transaction_template_service.validate_execute(
        template_id, current_user, data.pin
    )
    transaction = await transaction_service.create_transaction(
        request=CreateTransactionRequest(
            card_id=template.card_id,
            amount=float(template.amount),
            currency=template.currency,
            recipient=template.recipient,
            recipient_account_number=template.recipient_account_number,
            reference=template.reference,
        ),
        current_user=current_user,
    )

    await db.commit()
    background_tasks.add_task(transaction_service.process_transaction, transaction.id)
    return transaction
