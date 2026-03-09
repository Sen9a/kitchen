from dataclasses import dataclass, field
from typing import Any, Callable

from sqlalchemy.orm import selectinload, contains_eager

from src.managers.base_manager import BaseManager, FilterOperations
from src.models import Plane, Squad, DroneType, CommunicationType, VideoType
from sqlalchemy import select


@dataclass
class PlaneManager(BaseManager):
    model: 'Plane'= Plane
    filter_columns: dict[str, Callable] =  field(
        default_factory=lambda : {'name_ilike': lambda v: {'field': 'name', 'op': FilterOperations.i_like, 'value': v}}
    )
    joined_sort_by_fields: dict[str, Any] = field(default_factory=lambda: {'drone_type_name': DroneType.name,
                                                                   'communication_name': CommunicationType.name,
                                                                   'video_type_name': VideoType.name})


    async def get(self,
                  offset: int = 0,
                  limit: int = 100,
                  filters: dict[str, Any] | None = None,
                  order_by: list[str] | None = None) -> list[Any]:
        query = (select(self.model).
            join(self.model.drone_type).
            join(self.model.communication_type).
            join(self.model.video_type).
            offset(offset).
            limit(limit).
            options(
                contains_eager(self.model.drone_type),
                contains_eager(self.model.communication_type),
                contains_eager(self.model.video_type),
                selectinload(self.model.squads))
        )
        query = await self.add_filters(query, filters)
        if order_by:
            for sort_field in order_by:
                query = await self.sort_by_field(query,
                                                 sort_field,
                                                 self.joined_sort_by_fields)
        async with self.session_factory() as session:
            result = await session.execute(query)
            return list(result.scalars().all())

    async def create(self, payload: dict[str, Any]) -> Any:
        squads = payload.pop('squads', [])
        db_obj = self.model(**payload)
        async with self.session_factory() as session:
            session.add(db_obj)
            if squads:
                db_obj.squads.extend(squads)
            await session.flush()
            await session.refresh(db_obj)
        return db_obj

    async def update(self, plane_id: int, payload: dict[str, Any]) -> Any | None:
        async with self.session_factory() as session:
            query = select(self.model).where(self.model.id == plane_id).options(selectinload(self.model.squads))
            result = await session.execute(query)
            plane = result.scalar_one_or_none()
            if payload['squads']:
                squads = payload.pop('squads')
                squads_db = await session.execute(select(Squad).where(Squad.id.in_(squads)))
                squads = list(squads_db.scalars().all())
            for key, value in payload.items():
                setattr(plane, key, value)
            plane.squads = squads
            await session.flush()
            await session.refresh(plane)
        return plane
