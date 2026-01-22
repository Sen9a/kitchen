from dataclasses import dataclass

from .base_manager import BaseManager
from src.models import DroneType

@dataclass
class DroneTypeManager(BaseManager):
     model: 'DroneType'= DroneType
