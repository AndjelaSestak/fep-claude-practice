import asyncio
from datetime import timedelta
from typing import Optional

from app.database import AsyncSessionLocal
from app.models.card import CardStatus
from app.models.transaction import Transaction
from app.models.user import User
from app.repositories.card_repository import CardRepository
from app.repositories.transaction_repository import TransactionRepository
from app.repositories.wallet_repository import WalletRepository
from app.schemas.transaction import CreateTransactionRequest
from app.services.exchange_rate_service import convert_amount, get_supported_currencies
from app.utils.datetime import utc_now
from app.utils.enums import TransactionDirection, TransactionStatus, TransactionType
from app.utils.errors import (
    BadRequestError,
    TransactionNotFoundError,
)

PENDING_DELAY_SECONDS = 10


class TransactionService:
    def __init__(
        self,
        transaction_repository: TransactionRepository,
        wallet_repository: WalletRepository,
        card_repository: CardRepository,
    ) -> None:
        self.transaction_repository = transaction_repository
        self.wallet_repository = wallet_repository
        self.card_repository = card_repository

    def _determine_direction(
        self, transaction: Transaction, user_account: str
    ) -> TransactionDirection:
        """
        Determines transaction direction based on
          whether the user is the sender or recipient.
        Since direction is no longer stored in the database,
        it is derived from account numbers.
        """
        if transaction.sender_account_number == user_account:
            return TransactionDirection.outgoing
        return TransactionDirection.incoming

    async def _set_transaction_direction(
        self, transactions: list[Transaction], user_id: int
    ) -> None:
        """
        Enriches a list of transactions with direction info based on
        user's account number.
        """
        wallet = await self.wallet_repository.get_wallet_by_user_id(user_id)
        user_account = wallet.account_number if wallet else None

        for t in transactions:
            t.direction = (
                self._determine_direction(t, user_account)
                if user_account
                else TransactionDirection.incoming
            )

    async def get_transaction_by_user(
        self,
        user_id: int,
        search: Optional[str] = None,
        type: Optional[str] = None,
        direction: Optional[str] = None,
        limit: int = 10,
        offset: int = 0,
    ) -> list[Transaction]:

        results = await self.transaction_repository.get_by_user(
            user_id, search, limit, offset
        )
        await self._set_transaction_direction(results, user_id)
        return results

    async def create_transaction(
        self, request: CreateTransactionRequest, current_user: User
    ) -> Transaction:
        supported_currencies = [c["value"] for c in get_supported_currencies()]
        if request.currency.upper() not in supported_currencies:
            raise BadRequestError(f"Currency {request.currency} is not supported")

        card = await self.card_repository.get_by_id_and_user(
            request.card_id, current_user.id
        )

        if card.status != CardStatus.active:
            raise BadRequestError("Card is not active")

        if not card.is_email_verified:
            raise BadRequestError("Card is not verified")

        wallet = await self.wallet_repository.get_wallet_by_user_id(current_user.id)

        amount_converted = convert_amount(
            request.amount, request.currency, wallet.currency
        )

        transaction = Transaction(
            user_id=current_user.id,
            card_id=request.card_id,
            type=TransactionType.single,
            amount=amount_converted,
            currency=wallet.currency,
            recipient=request.recipient,
            recipient_account_number=request.recipient_account_number,
            sender=current_user.name,
            sender_account_number=wallet.account_number,
            reference=request.reference,
            status=TransactionStatus.pending,
        )
        self.transaction_repository.add(transaction)
        await self.transaction_repository.flush()
        await self.transaction_repository.refresh(transaction)
        await self._set_transaction_direction([transaction], current_user.id)
        return transaction

    async def _process_sender(self, transaction: Transaction) -> bool:
        """
        Deducts the transaction amount from the sender's wallet.
        Returns False and marks transaction as failed if wallet not found
        or insufficient funds.
        """

        wallet = await self.wallet_repository.get_wallet_by_user_id(transaction.user_id)
        if not wallet:
            self.transaction_repository.update_status(
                transaction, TransactionStatus.failed
            )
            return False

        if float(wallet.balance) < float(transaction.amount):
            self.transaction_repository.update_status(
                transaction, TransactionStatus.failed
            )
            return False

        wallet.balance = float(wallet.balance) - float(transaction.amount)
        self.transaction_repository.update_status(
            transaction, TransactionStatus.completed
        )
        return True

    async def _process_recipient(self, transaction: Transaction) -> None:
        """
        Credits the transaction amount to the recipient's wallet and creates
        an incoming transaction record.
        """
        recipient_wallet = await self.wallet_repository.get_by_account_number(
            transaction.recipient_account_number
        )

        converted_amount = convert_amount(
            float(transaction.amount), transaction.currency, recipient_wallet.currency
        )
        recipient_wallet.balance = float(recipient_wallet.balance) + converted_amount

    async def complete_pending_transaction(self, transaction: Transaction) -> None:
        if transaction.status != TransactionStatus.pending:
            return
        success = await self._process_sender(transaction)
        if success:
            await self._process_recipient(transaction)

    async def process_transaction(self, transaction_id: int) -> None:
        await asyncio.sleep(PENDING_DELAY_SECONDS)
        async with AsyncSessionLocal() as db:
            try:
                service = TransactionService(
                    transaction_repository=TransactionRepository(db),
                    wallet_repository=WalletRepository(db),
                    card_repository=CardRepository(db),
                )
                transaction = await service.transaction_repository.get_by_id(
                    transaction_id
                )
                if not transaction:
                    raise TransactionNotFoundError("Transaction not found")
                await service.complete_pending_transaction(transaction)
                await db.commit()
            except Exception:
                await db.rollback()
                raise

    async def process_expired_pending_transactions(self) -> None:
        cutoff = utc_now() - timedelta(seconds=PENDING_DELAY_SECONDS)

        transactions = await self.transaction_repository.get_pending_expired(cutoff)

        for transaction in transactions:
            await self.complete_pending_transaction(transaction)

    async def get_transaction_by_id(self, transaction_id: int, user_id: int):

        transaction = await self.transaction_repository.get_by_id_and_user(
            transaction_id, user_id
        )
        if not transaction:
            raise TransactionNotFoundError("Transaction not found or access denied")
        await self._set_transaction_direction([transaction], user_id)
        return transaction

    async def cancel_transaction(
        self, transaction_id: int, current_user: User
    ) -> Transaction:
        transaction = await self.transaction_repository.get_by_id_and_user(
            transaction_id, current_user.id
        )
        if not transaction:
            raise TransactionNotFoundError("Transaction not found")

        if transaction.status != TransactionStatus.pending:
            raise BadRequestError("Only pending transactions can be cancelled")

        wallet = await self.wallet_repository.get_wallet_by_user_id(current_user.id)
        user_account = wallet.account_number if wallet else None

        if transaction.sender_account_number != user_account:
            raise BadRequestError("Only the sender can cancel a transaction")

        self.transaction_repository.update_status(
            transaction, TransactionStatus.cancelled
        )
        await self.transaction_repository.flush()
        await self.transaction_repository.refresh(transaction)
        await self._set_transaction_direction([transaction], current_user.id)
        return transaction

    async def get_filtered_transactions(
        self,
        user_id: int,
        search: Optional[str] = None,
        type: Optional[str] = None,
        direction: Optional[str] = None,
        period: Optional[str] = None,
        limit: Optional[int] = None,
        offset: int = 0,
    ) -> list[Transaction]:

        transactions = await self.transaction_repository.get_filtered(
            user_id, search, type, direction, period, limit, offset
        )
        await self._set_transaction_direction(transactions, user_id)

        return transactions
