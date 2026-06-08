from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.wallet import Wallet
from app.repositories.base_repository import BaseRepository
from app.utils.errors import DatabaseTransactionError


class WalletRepository(BaseRepository[Wallet]):
    def __init__(self, db: AsyncSession):
        super().__init__(db)

    async def get_wallet_by_user_id(self, user_id: int) -> Wallet | None:
        try:
            result = await self.db.execute(
                select(Wallet).where(
                    Wallet.user_id == user_id,
                    Wallet.is_active == True,
                )
            )
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching the wallet."
            ) from e

    def deactivate(self, wallet: Wallet) -> Wallet:
        wallet.is_active = False
        return wallet

    async def get_by_account_number(self, account_number: str) -> Wallet | None:
        try:
            result = await self.db.execute(
                select(Wallet).where(
                    Wallet.account_number == account_number,
                    Wallet.is_active == True,
                )
            )
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching the wallet."
            ) from e
