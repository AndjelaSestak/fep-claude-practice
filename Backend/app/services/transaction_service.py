import asyncio
from datetime import date, timedelta
import io
import csv
from weasyprint import HTML
from sqlalchemy.orm import Session
from typing import Optional
from sqlalchemy import String, or_
from app.models.transaction import Transaction, TransactionStatus, TransactionDirection, TransactionType
from app.models.card import Card, CardStatus
from app.models.wallet import Wallet
from app.models.user import User
from app.schemas.transaction import CreateTransactionRequest
from app.services.exchange_rate_service import convert_amount, get_supported_currencies
from app.database import SessionLocal
from app.utils.datetime import utc_now
from sqlalchemy.exc import SQLAlchemyError
from app.utils.errors import CardNotFoundError, DatabaseTransactionError, InvalidTokenError, TransactionNotFoundError, WalletNotFoundError, BadRequestError


PENDING_DELAY_SECONDS = 10

def getTransactionByUser(db: Session, user_id: int, search: Optional[str] = None, limit: int = 10, offset: int = 0,):
    query = db.query(Transaction).filter(
        or_(Transaction.user_id == user_id,
            Transaction.recipient_account_number == db.query(Wallet.account_number).filter(Wallet.user_id == user_id).scalar_subquery())
    )

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Transaction.recipient.ilike(search_pattern)) |
            (Transaction.sender.ilike(search_pattern)) |
            (Transaction.reference.ilike(search_pattern))
        )
        

    return query.order_by(Transaction.created_at.desc()).offset(offset).limit(limit).all()

def create_transaction(db: Session, request: CreateTransactionRequest, current_user: User) -> Transaction:
    supported_currencies = [c["value"] for c in get_supported_currencies()]
    if request.currency.upper() not in supported_currencies:
        raise BadRequestError(f"Currency {request.currency} is not supported")

    card = db.query(Card).filter(
        Card.id == request.card_id,
        Card.user_id == current_user.id
    ).first()

    if not card:
        raise CardNotFoundError("Card not found or does not belong to you")

    if card.status != CardStatus.active:
        raise BadRequestError("Card is not active")

    if not card.is_email_verified:
        raise BadRequestError("Card is not verified")

    wallet = db.query(Wallet).filter(
        Wallet.user_id == current_user.id,
        Wallet.is_active == True
    ).first()

    if not wallet:
        raise WalletNotFoundError("Wallet not found")

    amount_converted = convert_amount(request.amount, request.currency, wallet.currency)

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
    try:
        db.add(transaction)
        db.commit()
        db.refresh(transaction)
        # set non-persistent/computed attribute after refresh so SQLAlchemy
        # doesn't attempt to map it to a DB column that no longer exists
        try:
            transaction.direction = TransactionDirection.outgoing
        except Exception:
            pass
    except SQLAlchemyError:
        raise DatabaseTransactionError("An error occurred while creating the transaction. Please try again.")
    return transaction


def _process_sender(db: Session, transaction: Transaction) -> bool:
    sender_wallet = db.query(Wallet).filter(
        Wallet.user_id == transaction.user_id,
        Wallet.is_active == True
    ).first()

    if not sender_wallet:
        transaction.status = TransactionStatus.failed
        db.commit()
        return False

    if float(sender_wallet.balance) < float(transaction.amount):
        transaction.status = TransactionStatus.failed
        db.commit()
        return False

    sender_wallet.balance = float(sender_wallet.balance) - float(transaction.amount)
    transaction.status = TransactionStatus.completed
    return True


def _process_recipient(db: Session, transaction: Transaction) -> None:
    recipient_wallet = db.query(Wallet).filter(
        Wallet.account_number == transaction.recipient_account_number,
        Wallet.is_active == True
    ).first()

    if not recipient_wallet:
        return

    converted_amount = convert_amount(
        float(transaction.amount),
        transaction.currency,
        recipient_wallet.currency
    )
    recipient_wallet.balance = float(recipient_wallet.balance) + converted_amount



def complete_pending_transaction(db: Session, transaction: Transaction) -> None:
    if transaction.status != TransactionStatus.pending:
        return
    try:
        success = _process_sender(db, transaction)
        if success:
            _process_recipient(db, transaction)
        db.commit()
    except Exception:
        db.rollback()
        raise


async def process_transaction(transaction_id: int) -> None:
    await asyncio.sleep(PENDING_DELAY_SECONDS)
    db: Session = SessionLocal()
    try:
        transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
        if not transaction:
            raise TransactionNotFoundError("Transaction not found")
        complete_pending_transaction(db, transaction)
    except Exception:
        db.rollback()
    finally:
        db.close()


def process_expired_pending_transactions(db: Session) -> None:
    cutoff = utc_now() - timedelta(seconds=PENDING_DELAY_SECONDS)

    transactions = db.query(Transaction).filter(
        Transaction.status == TransactionStatus.pending,
        Transaction.created_at <= cutoff,
    ).all()

    for transaction in transactions:
        complete_pending_transaction(db, transaction)

    

def get_transaction_by_id(db: Session, transaction_id: int, user_id: int):
    user_account = db.query(Wallet.account_number).filter(
        Wallet.user_id == user_id
    ).scalar()

    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        or_(
            Transaction.user_id == user_id,
            Transaction.recipient_account_number == user_account
        )
    ).first()

    if transaction:
        try:
            if user_account and transaction.sender_account_number == user_account:
                transaction.direction = TransactionDirection.outgoing
            else:
                transaction.direction = TransactionDirection.incoming
        except Exception:
            transaction.direction = TransactionDirection.incoming

    return transaction

def cancel_transaction(db: Session, transaction_id: int, current_user: User) -> Transaction:
    user_account = db.query(Wallet.account_number).filter(
        Wallet.user_id == current_user.id
    ).scalar_subquery()

    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        or_(
            Transaction.user_id == current_user.id,
            Transaction.recipient_account_number == user_account
        )
    ).first()

    if not transaction:
        raise TransactionNotFoundError("Transaction not found")

    if transaction.status != TransactionStatus.pending:
        raise BadRequestError("Only pending transactions can be cancelled")

    actual_account = db.query(Wallet.account_number).filter(
        Wallet.user_id == current_user.id
    ).scalar()

    if transaction.sender_account_number != actual_account:
        raise BadRequestError("Only the sender can cancel a transaction")

    transaction.status = TransactionStatus.cancelled
    try:
        db.commit()
        db.refresh(transaction)
    except SQLAlchemyError:
        raise DatabaseTransactionError("An error occurred while cancelling the transaction. Please try again.")

    # compute direction before returning so response model has it
    try:
        actual_account = db.query(Wallet.account_number).filter(Wallet.user_id == current_user.id).scalar()
    except Exception:
        actual_account = None

    try:
        if actual_account and transaction.sender_account_number == actual_account:
            transaction.direction = TransactionDirection.outgoing
        else:
            transaction.direction = TransactionDirection.incoming
    except Exception:
        transaction.direction = TransactionDirection.incoming

    return transaction


def get_filtered_transactions(db: Session, user_id: int, search=None, type=None, direction=None, period=None, limit: int | None = None, offset: int = 0):
    
    user_account = db.query(Wallet.account_number).filter(
        Wallet.user_id == user_id
    ).scalar_subquery()

    query = db.query(Transaction).filter(
        or_(
            Transaction.user_id == user_id,
            Transaction.recipient_account_number == user_account
        )
    )

    
    if period == "current_month":
        from datetime import datetime, timezone
        today = datetime.now(timezone.utc)
        start_of_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        query = query.filter(Transaction.created_at >= start_of_month)

   
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Transaction.recipient.ilike(search_pattern)) |
            (Transaction.sender.ilike(search_pattern)) |
            (Transaction.reference.ilike(search_pattern))
        )

    
    if type and type != "all":
        query = query.filter(Transaction.type == type)


    if direction and direction != "all":
        if direction == "incoming":
            query = query.filter(Transaction.sender_account_number != user_account)
        elif direction == "outgoing":
            query = query.filter(Transaction.sender_account_number == user_account)


    query = query.order_by(Transaction.created_at.desc())

    if limit is not None:
        query = query.offset(offset).limit(limit)

    results = query.all()

    try:
        actual_account = db.query(Wallet.account_number).filter(Wallet.user_id == user_id).scalar()
    except Exception:
        actual_account = None

    for t in results:
        try:
            if actual_account and t.sender_account_number == actual_account:
                t.direction = TransactionDirection.outgoing
            else:
                t.direction = TransactionDirection.incoming
        except Exception:
            t.direction = TransactionDirection.incoming

    return results
