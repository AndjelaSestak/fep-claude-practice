from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.card import Card
from app.models.card_type import CardType
from app.models.email_verification import EmailVerification, VerificationPurpose
from app.repositories.base_repository import BaseRepository
from app.utils.errors import DatabaseTransactionError


class CardRepository(BaseRepository[Card]):
    def __init__(self, db: AsyncSession):
        super().__init__(db)

    async def get_all_by_user(self, user_id: int) -> Sequence[Card]:
        try:
            result = await self.db.execute(
                select(Card)
                .options(selectinload(Card.wallet))
                .where(
                    Card.user_id == user_id,
                    Card.is_deleted == False,
                )
            )
            return result.scalars().all()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching cards."
            ) from e

    async def get_by_id_and_user(self, card_id: int, user_id: int) -> Card | None:
        try:
            result = await self.db.execute(
                select(Card)
                .options(selectinload(Card.wallet))
                .where(
                    Card.id == card_id,
                    Card.user_id == user_id,
                    Card.is_deleted == False,
                )
            )
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching the card."
            ) from e

    async def get_card_type_by_id(self, card_type_id: int) -> CardType | None:
        try:
            result = await self.db.execute(
                select(CardType).where(CardType.id == card_type_id)
            )
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching the card type."
            ) from e

    async def get_card_verification(
        self, card_id: int, otp_code: str
    ) -> EmailVerification | None:
        try:
            result = await self.db.execute(
                select(EmailVerification)
                .where(
                    EmailVerification.card_id == card_id,
                    EmailVerification.token == otp_code,
                    EmailVerification.purpose == VerificationPurpose.card_verification,
                    EmailVerification.is_used == False,
                )
                .order_by(EmailVerification.expires_at.desc())
            )
            return result.scalars().first()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching the card verification."
            ) from e

    async def delete(self, card: Card, soft_delete: bool = True) -> Card:
        if soft_delete:
            card.is_deleted = True
        else:
            await self.db.delete(card)
        return card

    async def get_active_by_wallet_id(self, wallet_id: int) -> Card | None:
        try:
            result = await self.db.execute(
                select(Card).where(
                    Card.wallet_id == wallet_id,
                    Card.status == CardStatus.active,
                    Card.is_deleted == False,
                )
            )
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching the card."
            ) from e
