from dataclasses import dataclass, field
from http.client import HTTPException
from typing import TYPE_CHECKING, Dict
from .base import BaseValidator

from src.services import PlaneService

if TYPE_CHECKING:
    from src.schemas import PlaneCreate


@dataclass
class PlaneValidator(BaseValidator):
    payload: 'PlaneCreate'
    service: 'PlaneService' = field(default_factory=PlaneService)

    async def validate_name(self) -> Dict[str, str] | None:
        item = await self.service.get_all(self.payload)
        if item:
            return {'name': "Plane with this name already exists"}



async def validate_plane(payload: 'PlaneCreate'):
    validator_inst = PlaneValidator(payload)
    errors = await validator_inst.validate()
    if errors:
        return errors



