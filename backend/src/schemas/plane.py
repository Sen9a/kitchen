from typing import TYPE_CHECKING

from pydantic import BaseModel, ConfigDict

from .drone_type import DroneType
from .video_type import VideoType

if TYPE_CHECKING:
    from .squads import SquadReadPlanes

class PlaneBase(BaseModel):
    id: int
    model_config = ConfigDict(from_attributes=True)

class Plane(PlaneBase):
    name: str | None = None
    image_url: str | None = None


class PlaneCreate(BaseModel):
    name: str
    type: int | None = None
    communication: int | None = None
    video_type_id: int | None = None
    squads: list[int] = []

class PlaneUpdate(PlaneCreate):
    pass

class PlaneDetails(Plane):
    drone_type: DroneType | None = None
    communication_type: DroneType | None = None
    video_type: VideoType | None = None
    squads: list["SquadReadPlanes"]

class PlaneRead(BaseModel):
    name: str | None = None
    type: int | None = None
    communication: int | None = None
    video_type_id: int | None = None
    limit: int = 100
    offset: int = 0
    order_by: list[str] = []
