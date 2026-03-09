from dataclasses import dataclass, field

from src.managers import VideoTypeManager
from src.schemas import VideoType, VideoTypeRead
from src.services.base_service import BaseService


@dataclass
class VideoTypeService(BaseService[VideoType | VideoTypeRead]):
    manager: 'VideoTypeManager' = field(default_factory=VideoTypeManager)
