from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_async_db
from app.models.user import User
from app.repositories.card_repository import CardRepository
from app.repositories.wallet_repository import WalletRepository
from app.schemas.card import CardCreate, CardPinVerify, CardResponse, CardVerify
from app.services.card_service import CardService
from app.utils.permissions import AsyncRequireRole

router = APIRouter(prefix="/cards", tags=["Cards"])

require_user = AsyncRequireRole(["user"])


def get_card_service(db: AsyncSession = Depends(get_async_db)) -> CardService:
    return CardService(
        card_repository=CardRepository(db),
        wallet_repository=WalletRepository(db),
    )


@router.post("/create_card", response_model=CardResponse, status_code=201)
async def add_card(
    card_data: CardCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(require_user),
    service: CardService = Depends(get_card_service),
):
    return await service.create_card(current_user, card_data, background_tasks)


@router.post("/verify_card", status_code=200)
async def verify_card_endpoint(
    data: CardVerify,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(require_user),
    service: CardService = Depends(get_card_service),
):
    return await service.verify_card(data, background_tasks, current_user)


@router.post("/verify_pin", status_code=200)
async def verify_pin_endpoint(
    data: CardPinVerify,
    current_user: User = Depends(require_user),
    service: CardService = Depends(get_card_service),
):
    return await service.verify_card_pin(data, current_user)


@router.get("/get_card_details/{card_id}", response_model=CardResponse)
async def get_card_details(
    card_id: int,
    current_user: User = Depends(require_user),
    service: CardService = Depends(get_card_service),
):
    return await service.get_card_by_id(current_user, card_id)


@router.get("/get_my_cards", response_model=list[CardResponse])
async def get_cards(
    current_user: User = Depends(require_user),
    service: CardService = Depends(get_card_service),
):
    return await service.get_user_cards(current_user)


@router.delete("/delete_card/{card_id}")
async def delete_card(
    card_id: int,
    current_user: User = Depends(require_user),
    service: CardService = Depends(get_card_service),
):
    return await service.soft_delete_card(current_user, card_id)
