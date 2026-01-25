from dataclasses import dataclass, field
from typing import Optional, TYPE_CHECKING

from src.managers import PlaneManager
from src.services.base_service import BaseService
from src.services.files_service import FilesService

if TYPE_CHECKING:
    from src.schemas import PlaneCreate
    from fastapi import UploadFile

@dataclass
class PlaneService(BaseService):
    manager: 'PlaneManager' = field(default_factory=PlaneManager)
    file_service: FilesService = field(default_factory=FilesService)


    async def create(self, payload: 'PlaneCreate', image: 'UploadFile') -> Optional['PlaneCreate']:
        file_path = str(await self.file_service.put_file(image))
        return await self.manager.create({**payload.model_dump(), 'image_url': file_path})
