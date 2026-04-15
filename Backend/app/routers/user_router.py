from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.user import UserPasswordUpdate, UserResponse, UserUpdate
from app.dependencies import get_db
from app.services.user_service import change_password, delete_user_by_id, get_all_users, get_user_by_id, update_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/getAllUsers", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return get_all_users(db)
    
@router.get("/getUserById/{user_id}", response_model=UserResponse)
def get_user_by_id_route(user_id: int, db: Session = Depends(get_db)):
    return get_user_by_id(db, user_id)

@router.delete("/deleteUserById/{user_id}")
def delete_user_by_id_route(user_id: int, db: Session = Depends(get_db)):
    delete_user_by_id(db, user_id)
    return {"detail": f"User with id {user_id} has been deleted successfully."}

@router.patch("/updateUserById/{user_id}", response_model=UserResponse)
def update_user_by_id_route(user_id: int, user_data: UserUpdate, db: Session = Depends(get_db)):
    return update_user(db, user_id, user_data)

@router.patch("/changePassword/{user_id}", response_model=UserResponse)
def change_password_route(user_id: int, user_password_update: UserPasswordUpdate, db: Session = Depends(get_db)):
    return change_password(db, user_id, user_password_update)
