from pydantic import BaseModel, ConfigDict

class DroneTypeBase(BaseModel):
    name: str | None = None

class DroneTypeCreate(DroneTypeBase):
    pass

class DroneTypeUpdate(DroneTypeBase):
    pass

class DroneTypeRead(DroneTypeBase):
    limit: int = 100
    offset: int = 0

class DroneType(DroneTypeBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

