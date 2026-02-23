from pydantic import BaseModel, ConfigDict
from src.const import DroneType as DroneTypeConst

class DroneTypeBase(BaseModel):
    name: str | None = None

class DroneTypeCreate(DroneTypeBase):
    pass

class DroneTypeUpdate(DroneTypeBase):
    pass

class DroneTypeRead(BaseModel):
    name: str | None = None
    limit: int = 100
    offset: int = 0
    order_by: list[str] = [str(DroneTypeConst.NAME)]

class DroneType(DroneTypeBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

