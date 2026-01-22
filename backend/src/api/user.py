from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional

from src.managers import UserManager
from src.schemas.user import User, UserCreate, UserUpdate, UserRead

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    manager = UserManager()
    return await manager.create(user.model_dump())

@router.get("/", response_model=List[User])
async def read_users(filter_payload: Optional[UserRead] = Depends()):
    manager = UserManager()
    if filter_payload:
        return await manager.get_all(
            offset=filter_payload.offset,
            limit=filter_payload.limit,
            filters=filter_payload.model_dump(exclude={"limit", "offset"}, exclude_unset=True)
        )
    return await manager.get_all()

@router.get("/{user_id}", response_model=User)
async def read_user(user_id: int):
    manager = UserManager()
    db_user = await manager.get_by_id(user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.put("/{user_id}", response_model=User)
async def update_user(user_id: int, user: UserUpdate):
    manager = UserManager()
    db_user = await manager.update(user_id, user.model_dump(exclude_unset=True))
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int):
    manager = UserManager()
    success = await manager.delete(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
