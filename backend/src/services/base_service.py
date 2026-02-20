from dataclasses import dataclass, field
from typing import Optional, List, TYPE_CHECKING, Dict, Any, TypeVar, Generic

from pydantic import BaseModel

from src.managers import CommunicationTypeManager

if TYPE_CHECKING:
    from src.managers.base_manager import BaseManager

T = TypeVar('T', bound='BaseModel')


@dataclass
class BaseService(Generic[T]):
    manager: 'BaseManager' = field(default_factory=CommunicationTypeManager)

    @staticmethod
    async def get_filter_payload(filter_payload: T) -> Dict[str, Any]:
        return {"offset": filter_payload.offset if hasattr(filter_payload, "offset") else 0,
                "limit": filter_payload.limit if hasattr(filter_payload, "limit") else 100,
                "filters": filter_payload.model_dump(exclude={"limit", "offset"},
                                                     exclude_unset=True)}

    async def get_all(self, filter_payload: T) -> List[T]:
        payload_filter = await self.get_filter_payload(filter_payload)
        return await self.manager.get(**payload_filter)

    async def create(self, payload: T) -> Optional[T]:
        return await self.manager.create(payload.model_dump())

    async def get(self, drone_type_id: int) -> Optional[T]:
        filter_payload = {"filters": {"id": drone_type_id}}
        return next(iter(await self.manager.get(**filter_payload)), None)

    async def put(self, instance_id: int, payload: T) -> Optional[T]:
        drone_type = await self.get(instance_id)
        if drone_type:
            drone_type = await self.manager.update(instance_id, payload.model_dump(exclude_unset=True))
            return drone_type
        return None

    async def delete(self, drone_type_id: int) -> bool:
        return await self.manager.delete(drone_type_id)
