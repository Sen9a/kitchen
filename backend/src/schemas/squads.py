from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from .plane import Plane

class SquadBase(BaseModel):
    name: str | None = None
    device: List[Plane] = []

class SquadCreate(SquadBase):
    pass

class SquadUpdate(SquadBase):
    pass

class SquadRead(SquadBase):
    limit: int = 100
    offset: int = 0

class Squad(SquadBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
