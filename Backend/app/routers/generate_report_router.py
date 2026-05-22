from datetime import date

from fastapi import APIRouter, Depends, Response, Query
from sqlalchemy.orm import  Session
from typing import Annotated

from app.database import get_db
from app.models.user import User
from app.services import generate_report_service, transaction_service
from app.utils.permissions import RequireRole
from app.utils.enums import TransactionFilterParams

router = APIRouter(prefix="/generate_report/export", tags=["Generate Report"])

require_user = RequireRole(["user"])


@router.get("/csv")
async def export_transactions_csv(
    filters: Annotated[TransactionFilterParams, Query()],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user)
):
    transactions = transaction_service.get_filtered_transactions(
        db, current_user.id,  filters.search, filters.type, filters.direction, filters.period
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


@router.get("/pdf")
async def export_transactions_pdf(
    filters: Annotated[TransactionFilterParams, Query()],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user)
):
    transactions = transaction_service.get_filtered_transactions(
        db, current_user.id, filters.search, filters.type, filters.direction, filters.period
    )

    filename_base = f"izvestaj_{date.today()}"
    pdf_data = generate_report_service.generate_pdf_report(transactions, current_user.email)

    return Response(
        content=pdf_data,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename_base}.pdf"}
    )
