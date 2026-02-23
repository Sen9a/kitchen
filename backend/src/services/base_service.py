from dataclasses import dataclass, field
from typing import TYPE_CHECKING, Any, TypeVar, Generic

from pydantic import BaseModel

from src.managers import CommunicationTypeManager

if TYPE_CHECKING:
    from src.managers.base_manager import BaseManager

T = TypeVar('T', bound='BaseModel')


@dataclass
class BaseService(Generic[T]):
    manager: 'BaseManager' = field(default_factory=CommunicationTypeManager)

    @staticmethod
    async def get_payload(filter_payload: T) -> dict[str, Any]:
        return {"offset": filter_payload.offset if hasattr(filter_payload, "offset") else 0,
                "limit": filter_payload.limit if hasattr(filter_payload, "limit") else 100,
                "order_by": filter_payload.order_by if hasattr(filter_payload, "order_by") else None,
                "filters": filter_payload.model_dump(exclude={"limit", "offset", "order_by"},
                                                     exclude_unset=True)}

    async def get_all(self, payload: T) -> list[T]:
        payload = await self.get_payload(payload)
        return await self.manager.get(**payload)

    async def create(self, payload: T) -> T | None:
        return await self.manager.create(payload.model_dump())

    async def get(self, id_: int) -> T | None:
        filter_payload = {"filters": {"id": id_}}
        return next(iter(await self.manager.get(**filter_payload)), None)

    async def put(self, instance_id: int, payload: T) -> T | None:
        obj = await self.manager.update(instance_id, payload.model_dump(exclude_unset=True))
        return obj

    async def delete(self, drone_type_id: int) -> bool:
        return await self.manager.delete(drone_type_id)
