from dataclasses import dataclass, field

from src.managers import DroneTypeManager
from src.services.base_service import BaseService


@dataclass
class DroneTypeService(BaseService):
    manager: 'DroneTypeManager' = field(default_factory=DroneTypeManager)
