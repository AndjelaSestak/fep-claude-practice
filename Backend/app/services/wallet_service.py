import secrets
import string

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.wallet import Wallet
from app.repositories.wallet_repository import WalletRepository
from app.schemas.wallet import WalletBalanceResponse
from app.utils.errors import WalletNotFoundError


async def generate_account_number(db: AsyncSession) -> str:
    while True:
        account_number = "".join(secrets.choice(string.digits) for _ in range(16))
        result = await db.execute(
            select(Wallet.id).where(Wallet.account_number == account_number)
        )
        if result.scalar_one_or_none() is None:
            return account_number


class WalletService:
    def __init__(self, wallet_repository: WalletRepository) -> None:
        self.wallet_repository = wallet_repository

    async def get_wallet_balance(self, current_user: User) -> WalletBalanceResponse:
        wallet = await self.wallet_repository.get_wallet_by_user_id(current_user.id)
        if not wallet:
            raise WalletNotFoundError("Active wallet not found for the user.")
        return WalletBalanceResponse(
            balance=float(wallet.balance),
            currency=wallet.currency,
            account_number=wallet.account_number,
        )
