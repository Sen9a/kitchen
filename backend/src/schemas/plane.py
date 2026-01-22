from pydantic import BaseModel, ConfigDict
from .drone_type import DroneType
from .communication_type import CommunicationType

class PlaneBase(BaseModel):
    name: str | None = None

class PlaneCreate(PlaneBase):
    type: int
    communication: int

class PlaneUpdate(PlaneBase):
    pass

class PlaneRead(PlaneBase):
    limit: int = 100
    offset: int = 0

class Plane(PlaneBase):
    id: int
    image_url: str | None = None
    model_config = ConfigDict(from_attributes=True)

class PlaneDetails(Plane):
    drone_type: DroneType | None = None
    communication_type: CommunicationType | None = None