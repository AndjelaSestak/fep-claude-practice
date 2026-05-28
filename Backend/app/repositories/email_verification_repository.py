from sqlalchemy import select, update
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.email_verification import EmailVerification, VerificationPurpose
from app.repositories.base_repository import BaseRepository
from app.utils.errors import DatabaseTransactionError


class EmailVerificationRepository(BaseRepository[EmailVerification]):
    def __init__(self, db: AsyncSession):
        super().__init__(db)

    async def get_latest_registration_verification(
        self, user_id: int, token: str
    ) -> EmailVerification | None:
        try:
            result = await self.db.execute(
                select(EmailVerification)
                .where(
                    EmailVerification.user_id == user_id,
                    EmailVerification.token == token,
                    EmailVerification.purpose == VerificationPurpose.registration,
                    EmailVerification.is_used == False,
                )
                .order_by(EmailVerification.expires_at.desc())
            )
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching the email verification."
            ) from e

    async def mark_active_registration_verifications_used(self, user_id: int) -> None:
        try:
            await self.db.execute(
                update(EmailVerification)
                .where(
                    EmailVerification.user_id == user_id,
                    EmailVerification.purpose == VerificationPurpose.registration,
                    EmailVerification.is_used == False,
                )
                .values(is_used=True)
            )
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while updating email verifications."
            ) from e

    async def get_active_password_reset_verification(
        self, token: str
    ) -> EmailVerification | None:
        try:
            result = await self.db.execute(
                select(EmailVerification).where(
                    EmailVerification.token == token,
                    EmailVerification.purpose == VerificationPurpose.password_reset,
                    EmailVerification.is_used.is_(False),
                )
            )
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            raise DatabaseTransactionError(
                "An error occurred while fetching the password reset verification."
            ) from e
