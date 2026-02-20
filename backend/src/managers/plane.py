from dataclasses import dataclass
from typing import Optional, Dict, Any, List

from sqlalchemy.orm import selectinload

from src.managers.base_manager import BaseManager
from src.models import Plane
from sqlalchemy import select

@dataclass
class PlaneManager(BaseManager):
    model: 'Plane'= Plane


    async def get(self, offset: int = 0, limit: int = 100, filters: Optional[Dict[str, Any]] = None) -> List[Any]:
        query = (select(self.model).
                 offset(offset).
                 limit(limit).
                 options(
                     selectinload(self.model.drone_type),
                     selectinload(self.model.communication_type),
                     selectinload(self.model.video_type)
                 ))
        query = await self.add_filters(query, filters)
        async with self.session_factory() as session:
            result = await session.execute(query)
            return list(result.scalars().all())
