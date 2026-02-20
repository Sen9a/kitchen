from dataclasses import dataclass

from src.managers.base_manager import BaseManager
from src.models import Squad


@dataclass
class SquadsManager(BaseManager):
    model: 'Squad' = Squad

    async def select_squads(self, list_id: list[int]):
        squads = await self.get(filters={"id": {"in": list_id}})
