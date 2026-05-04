from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.utils.permissions import RequireRole
from app.models.user import User
from app.schemas.user import UserPasswordUpdate, UserResponse, UserUpdate
from app.dependencies import get_db
from app.dependencies import get_current_user
from app.services.user_service import change_password, delete_current_user, get_all_users, get_user_by_id, update_current_user

router = APIRouter(prefix="/users", tags=["Users"])

require_user = RequireRole(["user"])

@router.get("/getAllUsers", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db), current_user: User = Depends(require_user)):
    return get_all_users(db)
    
@router.get("/getUserById/{user_id}", response_model=UserResponse)
def get_user_by_id_route(db: Session = Depends(get_db), current_user: User = Depends(require_user)):
    return get_user_by_id(db, current_user.id)

@router.delete("/me")
def delete_current_user_route(
    response: Response,
    current_user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    delete_current_user(db, current_user)
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"detail": "User has been deleted successfully."}

@router.patch("/me", response_model=UserResponse)
def update_current_user_route(
    user_data: UserUpdate,
    current_user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    return update_current_user(db, current_user, user_data)

@router.patch("/me/password", response_model=UserResponse)
def change_password_route(
    user_password_update: UserPasswordUpdate,
    current_user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    return change_password(db, current_user, user_password_update)