from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Annotated

from app.utils.permissions import RequireRole
from app.dependencies import get_db
from app.services import transaction_template_service, transaction_service
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.transaction_template import (
    TransactionTemplateCreate,
    TransactionTemplateResponse,
    TransactionTemplateUpdate,
    ExecuteTemplateRequest
)

router = APIRouter(prefix="/templates", tags=["Transaction Templates"])

require_user = RequireRole(["user"])

@router.post("/create_template", response_model=TransactionTemplateResponse, status_code=status.HTTP_201_CREATED)
def create_template(
    request: TransactionTemplateCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_user)
):
    return transaction_template_service.create_template(db, request, current_user)

@router.get("/get_template_details/{template_id}", response_model=TransactionTemplateResponse)
def get_template_details(
    template_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_user)
):
    return transaction_template_service.get_template_by_id(db, template_id, current_user)

@router.get("/get_all_templates", response_model=List[TransactionTemplateResponse])
def get_all_templates(
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_user)
):
    return transaction_template_service.get_templates(db, current_user)

@router.patch("/update_template/{template_id}", response_model=TransactionTemplateResponse)
def update_template(
    template_id: int,
    request: TransactionTemplateUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_user)
):
    return transaction_template_service.update_template(db, template_id, request, current_user)

@router.delete("/delete_template/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_template(
    template_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_user)
):
    transaction_template_service.delete_template(db, template_id, current_user)
    return None

@router.post("/{template_id}/execute", status_code=status.HTTP_201_CREATED)
def execute_template(
    template_id: int,
    data: ExecuteTemplateRequest,
    background_tasks: BackgroundTasks,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_user)
):
    return transaction_template_service.execute_template(db, template_id, current_user, background_tasks, data.pin)
