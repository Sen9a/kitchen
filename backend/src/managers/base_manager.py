from dataclasses import dataclass
from typing import Any, Dict, List, Optional, TYPE_CHECKING

from sqlalchemy import select, Select

from src.database import get_db_session

if TYPE_CHECKING:
    from src.models import Base


@dataclass
class BaseManager:
    model: type['Base']
    session_factory: Any = get_db_session

    async def add_filters(self, query: Select, filters: Dict[str, Any] | None) -> Select:
        if filters:
            for k, v in filters.items():
                if hasattr(self.model, k) and v is not None:
                    query = query.where(getattr(self.model, k) == v)
        return query

    async def create(self, payload: Dict[str, Any]) -> Any:
        db_obj = self.model(**payload)
        async with self.session_factory() as session:
            session.add(db_obj)
            await session.flush()
            await session.refresh(db_obj)
        return db_obj

    async def get(self, offset: int = 0, limit: int = 100, filters: Optional[Dict[str, Any]] = None) -> List[Any]:
        query = select(self.model).offset(offset).limit(limit)
        query = await self.add_filters(query, filters)
        async with self.session_factory() as session:
            result = await session.execute(query)
            return list(result.scalars().all())


    async def update(self, obj_id: int, payload: Dict[str, Any]) -> Optional[Any]:
        async with self.session_factory() as session:
            query = select(self.model).where(self.model.id == obj_id)
            result = await session.execute(query)
            db_obj = result.scalar_one_or_none()
            if not db_obj:
                return None
            
            for key, value in payload.items():
                setattr(db_obj, key, value)
            
            await session.flush()
            await session.refresh(db_obj)
        return db_obj

    async def delete(self, obj_id: int) -> bool:
        async with self.session_factory() as session:
            query = select(self.model).where(self.model.id == obj_id)
            result = await session.execute(query)
            db_obj = result.scalar_one_or_none()
            if db_obj:
                await session.delete(db_obj)
                await session.flush()
        return bool(db_obj)

