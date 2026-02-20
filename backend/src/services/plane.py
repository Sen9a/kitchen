from dataclasses import dataclass, field
from typing import Optional, TYPE_CHECKING, Union

from src.managers import PlaneManager
from src.schemas import PlaneCreate, PlaneBase
from src.services.base_service import BaseService
from src.services.files_service import FilesService

if TYPE_CHECKING:
    from fastapi import UploadFile

@dataclass
class PlaneService(BaseService[Union[PlaneCreate, PlaneBase]]):
    manager: 'PlaneManager' = field(default_factory=PlaneManager)
    file_service: FilesService = field(default_factory=FilesService)


    async def create_plane(self, payload: 'PlaneCreate', image: Optional['UploadFile']) -> Optional['PlaneCreate']:
        file_path = str(await self.file_service.put_file(image)) if image else None
        return await self.manager.create({**payload.model_dump(), 'image_url': file_path})
