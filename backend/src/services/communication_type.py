from dataclasses import dataclass, field

from src.managers import CommunicationTypeManager
from src.schemas import CommunicationType
from src.services.base_service import BaseService



@dataclass
class CommunicationTypeService(BaseService[CommunicationType]):
    manager: 'CommunicationTypeManager' = field(default_factory=CommunicationTypeManager)
