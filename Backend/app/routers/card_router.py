from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session
from typing import List, Annotated

from app.schemas.card import CardCreate, CardResponse, CardVerify
from app.dependencies import get_db
from app.services.card_service import create_card, verify_card, get_user_cards, soft_delete_card, get_card_by_id
from app.services.auth_service import get_current_user
from app.models.user import User

router = APIRouter(prefix="/cards", tags=["Cards"])

@router.post("/CreateCard", response_model=CardResponse, status_code=201)
async def add_card(
    card_data: CardCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await create_card(db, current_user, card_data, background_tasks)

@router.post("/VerifyCard", status_code=200)
def verify_card_endpoint(
    data: CardVerify,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return verify_card(db=db, data=data, background_tasks=background_tasks, current_user=current_user)

@router.get("/GetCardDetails/{card_id}", response_model=CardResponse)
def get_card_details(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_card_by_id(db, current_user, card_id)

@router.get("/GetMyCards", response_model=List[CardResponse])
def get_cards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_cards(db, current_user)

@router.delete("/DeleteCard/{card_id}")
def delete_card(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return soft_delete_card(db, current_user, card_id)