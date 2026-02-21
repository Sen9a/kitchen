from dataclasses import dataclass, field
from typing import TYPE_CHECKING

from src.schemas import PlaneCreate
from .base import BaseValidator

from src.managers import PlaneManager
from ..services import PlaneService

if TYPE_CHECKING:
    from src.schemas import PlaneBase


@dataclass
class PlaneValidator(BaseValidator):
    payload: "PlaneBase | PlaneCreate"
    service: PlaneService = field(default_factory=PlaneService)

    async def validate_name(self) -> dict[str, str] | None:
        if self.payload.name:
            # Use manager directly to check if plane with this name exists
            planes = await self.service.get_plane_name(self.payload.name)
            if planes:
                return {'name': "Plane with this name already exists"}
        return None

    async def validate_id(self) -> dict[str, str] | None:
        if hasattr(self.payload, 'id'):
            plane = await self.service.get(self.payload.id)
            if not plane:
                return {'id': "Plane with this id already exists"}
        return None


async def validate_plane(payload: "PlaneBase | PlaneCreate") -> list[dict[str, str]] | None:
    validator_inst = PlaneValidator(payload)
    errors = await validator_inst.validate()
    if errors:
        return errors
    return None
