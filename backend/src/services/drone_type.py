from dataclasses import dataclass, field

from src.managers import DroneTypeManager
from src.schemas import DroneType, DroneTypeRead
from src.services.base_service import BaseService


@dataclass
class DroneTypeService(BaseService[DroneType | DroneTypeRead]):
    manager: 'DroneTypeManager' = field(default_factory=DroneTypeManager)
