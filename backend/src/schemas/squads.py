from pydantic import BaseModel, ConfigDict

class SquadBase(BaseModel):
    name: str | None = None
    device: list["Plane"] = []

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
