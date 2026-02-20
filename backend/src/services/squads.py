from dataclasses import dataclass, field


from src.managers.squads import SquadsManager
from src.schemas import Squad
from src.services.base_service import BaseService


@dataclass
class SquadsService(BaseService[Squad]):
    manager: 'SquadsManager' = field(default_factory=SquadsManager)