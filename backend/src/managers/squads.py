from dataclasses import dataclass

from src.managers.base_manager import BaseManager
from src.models import Squad


@dataclass
class SquadsManager(BaseManager):
    model: 'Squad' = Squad