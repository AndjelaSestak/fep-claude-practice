from datetime import date
from typing import Optional

from fastapi import APIRouter, Query, BackgroundTasks, Depends, Response, status
from sqlalchemy.orm import Session
from app.utils.permissions import RequireRole
from app.utils.errors import TransactionNotFoundError
from app.models.user import User
from app.services import generate_report_service

from app.dependencies import get_db
from app.services import transaction_service
from app.dependencies import get_current_user
from sqlalchemy.orm import Session
from app.schemas.transaction import CreateTransactionRequest, TransactionResponse


router = APIRouter(prefix="/transactions", tags=["Transactions"])

require_user = RequireRole(["user"])

@router.get("/all", status_code=status.HTTP_200_OK)
def get_all_transactions_for_user(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
    search: Optional[str] = Query(None),
    type: str = Query("all"),
    direction: str = Query("all"),
    period: Optional[str] = Query(None),
    limit: int = 10,
    offset: int = 0,
):
    transactions = transaction_service.get_filtered_transactions(
        db,
        current_user.id,
        search=search,
        type=type,
        direction=direction,
        period=period,
        limit=limit,
        offset=offset,
    )
    return transactions

@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    request: CreateTransactionRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user)
):
    transaction = transaction_service.create_transaction(db=db, request=request, current_user=current_user)
    background_tasks.add_task(transaction_service.process_transaction, transaction.id)
    return transaction

@router.get("/export/csv")
async def export_transactions_csv(
    search: str = None,
    type: str = None,
    direction: str = None,
    period: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user)
):
    transactions = transaction_service.get_filtered_transactions(
        db, current_user.id, search, type, direction, period
    )

    filename_base = f"izvestaj_{date.today()}"
    csv_data = generate_report_service.generate_csv_report(transactions)

    return Response(
        content=csv_data,
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f"attachment; filename*=UTF-8''{filename_base}.csv",
            "Cache-Control": "no-cache"
        }
    )

@router.get("/export/pdf")
async def export_transactions_pdf(
    search: str = None,
    type: str = None,
    direction: str = None,
    period: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user)
):
    transactions = transaction_service.get_filtered_transactions(
        db, current_user.id, search, type, direction, period
    )

    filename_base = f"izvestaj_{date.today()}"
    pdf_data = generate_report_service.generate_pdf_report(transactions, current_user.email)

    return Response(
        content=pdf_data,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename_base}.pdf"}
    )

@router.get("/{transaction_id}", response_model=TransactionResponse)
def read_transaction(
    transaction_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_user)
):
    db_transaction = transaction_service.get_transaction_by_id(
        db, transaction_id=transaction_id, user_id=current_user.id
    )
    if not db_transaction:
        raise TransactionNotFoundError("Transaction not found or access denied")
    return db_transaction


@router.delete("/{transaction_id}", response_model=TransactionResponse)
def cancel_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user)
):
    return transaction_service.cancel_transaction(db=db, transaction_id=transaction_id, current_user=current_user)


