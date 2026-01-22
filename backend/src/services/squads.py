from dataclasses import dataclass, field


from src.managers.squads import SquadsManager
from src.services.base_service import BaseService


@dataclass
class SquadsService(BaseService):
    manager: 'SquadsManager' = field(default_factory=SquadsManager)