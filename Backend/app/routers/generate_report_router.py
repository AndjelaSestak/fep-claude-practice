from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.repositories.card_repository import CardRepository
from app.repositories.transaction_repository import TransactionRepository
from app.repositories.wallet_repository import WalletRepository
from app.services.generate_report_service import GenerateReportService
from app.services.transaction_service import TransactionService
from app.utils.enums import TransactionFilterParams
from app.utils.permissions import AsyncRequireRole

router = APIRouter(prefix="/generate_report/export", tags=["Generate Report"])

require_user = AsyncRequireRole(["user"])


def get_transaction_service() -> TransactionService:
    return TransactionService(
        transaction_repository=TransactionRepository(),
        wallet_repository=WalletRepository(),
        card_repository=CardRepository(),
    )


def get_report_service() -> GenerateReportService:
    return GenerateReportService()


@router.get("/csv")
async def export_transactions_csv(
    filters: Annotated[TransactionFilterParams, Query()],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    transactions = get_transaction_service().get_filtered_transactions(
        db,
        current_user.id,
        filters.search,
        filters.type,
        filters.direction,
        filters.period,
    )

    filename_base = f"izvestaj_{date.today()}"
    csv_data = get_report_service().generate_csv_report(transactions)

    return Response(
        content=csv_data,
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f"attachment; filename*=UTF-8''{filename_base}.csv",
            "Cache-Control": "no-cache",
        },
    )


@router.get("/pdf")
async def export_transactions_pdf(
    filters: Annotated[TransactionFilterParams, Query()],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    transactions = get_transaction_service().get_filtered_transactions(
        db,
        current_user.id,
        filters.search,
        filters.type,
        filters.direction,
        filters.period,
    )

    filename_base = f"izvestaj_{date.today()}"
    pdf_data = get_report_service().generate_pdf_report(
        transactions, current_user.email
    )

    return Response(
        content=pdf_data,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename_base}.pdf"},
    )
