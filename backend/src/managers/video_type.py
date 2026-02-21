from dataclasses import dataclass

from .base_manager import BaseManager
from src.models import VideoType


@dataclass
class VideoTypeManager(BaseManager):
    model: 'VideoType' = VideoType
