from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_db
from app.models.user import User
from app.repositories.wallet_repository import WalletRepository
from app.schemas.wallet import WalletBalanceResponse
from app.services.wallet_service import WalletService
from app.utils.permissions import AsyncRequireRole

router = APIRouter(prefix="/wallet", tags=["Wallet"])

require_user = AsyncRequireRole(["user"])


def get_wallet_service(db: AsyncSession = Depends(get_async_db)) -> WalletService:
    return WalletService(
        wallet_repository=WalletRepository(db),
    )


@router.get("/me/balance", response_model=WalletBalanceResponse)
async def get_current_wallet_balance(
    current_user: User = Depends(require_user),
    service: WalletService = Depends(get_wallet_service),
):
    return await service.get_wallet_balance(current_user)
