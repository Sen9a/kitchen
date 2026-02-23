from dataclasses import dataclass, field

from src.managers import CommunicationTypeManager
from src.schemas import CommunicationType, CommunicationTypeRead
from src.services.base_service import BaseService



@dataclass
class CommunicationTypeService(BaseService[CommunicationType | CommunicationTypeRead]):
    manager: 'CommunicationTypeManager' = field(default_factory=CommunicationTypeManager)
