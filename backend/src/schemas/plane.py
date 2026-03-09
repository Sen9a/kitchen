from __future__ import annotations
from pydantic import BaseModel, ConfigDict, field_serializer
from .drone_type import DroneType
from .video_type import VideoType
from src.const import Plane as PlaneConst

class PlaneBase(BaseModel):
    id: int
    model_config = ConfigDict(from_attributes=True)

class Plane(PlaneBase):
    name: str | None = None
    image_url: str | None = None


class PlaneCreate(BaseModel):
    name: str
    drone_type_id: int | None = None
    communication_id: int | None = None
    video_type_id: int | None = None
    squads: list[int] = []

class PlaneUpdate(PlaneCreate):
    pass


class PlaneRead(BaseModel):
    name_ilike: str | None = None
    type: int | None = None
    communication: int | None = None
    video_type_id: int | None = None
    limit: int = 100
    offset: int = 0
    order_by: list[str] = [str(PlaneConst.NAME)]

class PlaneDetails(Plane):
    drone_type: DroneType | None = None
    communication_type: DroneType | None = None
    video_type: VideoType | None = None
    squads: list[SquadReadPlanes]

from .squads import SquadReadPlanes
PlaneDetails.model_rebuild()
