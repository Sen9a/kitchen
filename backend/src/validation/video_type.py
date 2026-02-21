from dataclasses import dataclass, field
from typing import TYPE_CHECKING
from .base import BaseValidator

from src.services import VideoTypeService

if TYPE_CHECKING:
    from src.schemas import VideoTypeCreate, VideoTypeUpdate


@dataclass
class VideoTypeValidator(BaseValidator):
    payload: "VideoTypeCreate | VideoTypeUpdate"
    service: 'VideoTypeService' = field(default_factory=VideoTypeService)

    async def validate_name(self) -> dict[str, str] | None:
        item = await self.service.get_all(self.payload)
        if item:
            return {'name': "Video type with this name already exists"}
        return None


async def validate_video_type(payload: "VideoTypeCreate | VideoTypeUpdate") -> list[dict[str, str]] | None:
    validator_inst = VideoTypeValidator(payload)
    errors = await validator_inst.validate()
    if errors:
        return errors
    return None
