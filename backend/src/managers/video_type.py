from dataclasses import dataclass

from .base_manager import BaseManager, FilterOperations
from src.models import VideoType


@dataclass
class VideoTypeManager(BaseManager):
    model: 'VideoType' = VideoType
    filter_columns = {'name_ilike': lambda v: {'field': 'name', 'op': FilterOperations.i_like, 'value': v}}
