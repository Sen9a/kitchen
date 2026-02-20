from pydantic import BaseModel, ConfigDict

class UserBase(BaseModel):
    name: str | None = None
    surname: str | None = None
    role: str | None = None

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
