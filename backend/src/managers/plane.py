from dataclasses import dataclass
from typing import TYPE_CHECKING, Any

from sqlalchemy.orm import selectinload

from src.managers.base_manager import BaseManager
from src.models import Plane
from sqlalchemy import select

if TYPE_CHECKING:
    from src.models import Squad

@dataclass
class PlaneManager(BaseManager):
    model: 'Plane'= Plane


    async def get(self, offset: int = 0, limit: int = 100, filters: dict[str, Any] | None = None) -> list[Any]:
        query = (select(self.model).
                 offset(offset).
                 limit(limit).
                 options(
                     selectinload(self.model.drone_type),
                     selectinload(self.model.communication_type),
                     selectinload(self.model.video_type),
                     selectinload(self.model.squads)
                 ))
        query = await self.add_filters(query, filters)
        async with self.session_factory() as session:
            result = await session.execute(query)
            return list(result.scalars().all())

    async def bound_squads(self, plane: Plane, squads: list['Squad']) -> Plane:
        async with self.session_factory() as session:
            plane.squads.extend(squads)
            await session.flush()
            await session.refresh(plane)
        return plane
