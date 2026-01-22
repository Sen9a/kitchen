from pydantic import BaseModel, ConfigDict
from typing import Optional

class UserBase(BaseModel):
    name: Optional[str] = None
    surname: Optional[str] = None
    role: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserUpdate(UserBase):
    pass

class UserRead(UserBase):
    limit: int = 100
    offset: int = 0

class User(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
