from dataclasses import dataclass, field
from typing import Optional, TYPE_CHECKING

from src.managers import PlaneManager
from src.services.base_service import BaseService
from src.services.files_service import FilesService

if TYPE_CHECKING:
    from src.schemas import PlaneCreate, PlaneDetails
    from fastapi import UploadFile

@dataclass
class PlaneService(BaseService):
    manager: 'PlaneManager' = field(default_factory=PlaneManager)
    file_service: FilesService = field(default=FilesService)


    async def create(self, payload: 'PlaneCreate', image: 'UploadFile') -> Optional['PlaneDetails']:
        file_path =  self.file_service.put_file(payload.image_name, image)
        return await self.manager.create({**payload.model_dump(), 'image_url': file_path})
