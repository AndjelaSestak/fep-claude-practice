from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session
from typing import List, Annotated

from app.utils.permissions import RequireRole
from app.schemas.card import CardCreate, CardResponse, CardVerify, CardPinVerify
from app.database import get_db
from app.services.card_service import create_card, verify_card, verify_card_pin, get_user_cards, soft_delete_card, get_card_by_id
from app.models.user import User

router = APIRouter(prefix="/cards", tags=["Cards"])


require_user = RequireRole(["user"])

@router.post("/create_card", response_model=CardResponse, status_code=201)
async def add_card(
    card_data: CardCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user)
):
    return await create_card(db, current_user, card_data, background_tasks)

@router.post("/verify_card", status_code=200)
def verify_card_endpoint(
    data: CardVerify,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    return verify_card(db=db, data=data, background_tasks=background_tasks, current_user=current_user)

@router.post("/verify_pin", status_code=200)
def verify_pin_endpoint(
    data: CardPinVerify,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user),
):
    return verify_card_pin(db=db, data=data, current_user=current_user)

@router.get("/get_card_details/{card_id}", response_model=CardResponse)
def get_card_details(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user)
):
    return get_card_by_id(db, current_user, card_id)

@router.get("/get_my_cards", response_model=List[CardResponse])
def get_cards(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user)
):
    return get_user_cards(db, current_user)

@router.delete("/delete_card/{card_id}")
def delete_card(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_user)
):
    return soft_delete_card(db, current_user, card_id)
