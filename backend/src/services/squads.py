from dataclasses import dataclass, field


from src.managers.squads import SquadsManager
from src.schemas import Squad
from src.services.base_service import BaseService


@dataclass
class SquadsService(BaseService[Squad]):
    manager: 'SquadsManager' = field(default_factory=SquadsManager)

    async def get_squads(self, list_id: list[int]) -> list[Squad]:
        payload = {"filters": {"id_in": list_id}}
        result = await self.manager.get(**payload)
        return result
