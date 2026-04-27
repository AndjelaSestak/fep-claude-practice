from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.schemas.recurring_transaction import RecurringTransactionBase
from app.dependencies import get_db
from app.services.recurring_transaction_service import create_recurring_transaction
from app.models.transaction_template import TransactionTemplate


router = APIRouter(prefix="/recurring-transactions", tags=["Recurring Transactions"])


