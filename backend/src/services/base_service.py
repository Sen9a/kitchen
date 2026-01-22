from dataclasses import dataclass, field
from typing import Optional, List, TYPE_CHECKING

from pydantic import BaseModel

from src.managers import CommunicationTypeManager

if TYPE_CHECKING:
    from src.managers.base_manager import BaseManager
    from fastapi import UploadFile

@dataclass
class BaseService:
    manager: 'BaseManager' = field(default_factory=CommunicationTypeManager)

    async def get_all(self, filter_payload: 'BaseModel') -> List['BaseModel']:
        payload_filter = {"offset": filter_payload.offset,
                          "limit": filter_payload.limit,
                          "filters": filter_payload.model_dump(exclude={"limit", "offset"},
                                                               exclude_unset=True)}
        return await self.manager.get(**payload_filter)

    async def create(self, payload: 'BaseModel', image: 'UploadFile') -> Optional['BaseModel']:
        return await self.manager.create(payload.model_dump())

    async def get(self, drone_type_id: int):
        filter_payload = {"filters": {"id": drone_type_id}}
        return next(iter(await self.manager.get(**filter_payload)), None)

    async def put(self, drone_type_id: int, payload: 'BaseModel') -> Optional['BaseModel']:
        drone_type = await self.get(drone_type_id)
        if drone_type:
            drone_type = await self.manager.update(drone_type.id, payload.model_dump(exclude_unset=True))
        return drone_type

    async def delete(self, drone_type_id: int) -> bool:
        return await self.manager.delete(drone_type_id)