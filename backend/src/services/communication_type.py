from dataclasses import dataclass, field

from src.managers import CommunicationTypeManager
from src.services.base_service import BaseService



@dataclass
class CommunicationTypeService(BaseService):
    manager: 'CommunicationTypeService' = field(default_factory=CommunicationTypeManager)
