from dataclasses import dataclass, field
from typing import TYPE_CHECKING, Any

from src.managers import PlaneManager
from src.schemas import PlaneCreate, PlaneRead, PlaneUpdate, PlaneDetails
from src.services.base_service import BaseService
from src.services.files_service import FilesService
from .squads import SquadsService

if TYPE_CHECKING:
    from fastapi import UploadFile

@dataclass
class PlaneService(BaseService[PlaneCreate | PlaneRead | PlaneUpdate | PlaneDetails]):
    manager: 'PlaneManager' = field(default_factory=PlaneManager)
    file_service: FilesService = field(default_factory=FilesService)


    async def create_plane(self, payload: 'PlaneCreate', image: "UploadFile | None") -> "PlaneCreate | None":
        file_path = str(await self.file_service.put_file(image)) if image else None
        squad = await SquadsService().get_squads(payload.squads)
        plane = await self.manager.create({**payload.model_dump(exclude={'squads'}),
                                           'image_url': file_path,
                                           'squads': squad})
        return plane

    async def get_plane_name(self, name) -> Any:
        filters = {"filters": {"name": name},
                   "limit": 1,
                   "offset": 0}
        result = await self.manager.get(**filters)
        return next(iter(result), None)
