from dataclasses import dataclass, field

from src.managers import VideoTypeManager
from src.schemas import VideoType
from src.services.base_service import BaseService


@dataclass
class VideoTypeService(BaseService[VideoType]):
    manager: 'VideoTypeManager' = field(default_factory=VideoTypeManager)
