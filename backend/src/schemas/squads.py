from __future__ import annotations
from pydantic import BaseModel, ConfigDict
from .plane import PlaneDetails

class SquadBase(BaseModel):
    name: str | None = None

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

class SquadReadPlanes(BaseModel):
    id: int
    name: str
    model_config = ConfigDict(from_attributes=True)

class SquadDetails(Squad):
    planes: list[PlaneDetails]
