from dataclasses import dataclass, field
from typing import TYPE_CHECKING, Dict, List, Union
from .base import BaseValidator

from src.services import VideoTypeService

if TYPE_CHECKING:
    from src.schemas import VideoTypeCreate, VideoTypeUpdate


@dataclass
class VideoTypeValidator(BaseValidator):
    payload: 'VideoTypeCreate'
    service: 'VideoTypeService' = field(default_factory=VideoTypeService)

    async def validate_name(self) -> Dict[str, str] | None:
        item = await self.service.get_all(self.payload)
        if item:
            return {'name': "Video type with this name already exists"}
        return None


async def validate_video_type(payload: Union['VideoTypeCreate', 'VideoTypeUpdate']) -> List[Dict[str, str]] | None:
    validator_inst = VideoTypeValidator(payload)
    errors = await validator_inst.validate()
    if errors:
        return errors
    return None
