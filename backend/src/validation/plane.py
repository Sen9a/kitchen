from dataclasses import dataclass, field
from typing import TYPE_CHECKING, Dict, List, Union

from src.schemas import PlaneCreate
from .base import BaseValidator

from src.managers import PlaneManager

if TYPE_CHECKING:
    from src.schemas import PlaneBase


@dataclass
class PlaneValidator(BaseValidator):
    payload: Union['PlaneBase', 'PlaneCreate']
    manager: PlaneManager = field(default_factory=PlaneManager)

    async def validate_name(self) -> Dict[str, str] | None:
        if self.payload.name:
            # Use manager directly to check if plane with this name exists
            planes = await self.manager.get(
                offset=0,
                limit=1,
                filters={"name": self.payload.name}
            )
            if planes:
                return {'name': "Plane with this name already exists"}
        return None

    async def validate_id(self) -> Dict[str, str] | None:
        if hasattr(self.payload, 'id'):
            plane = await self.manager.get(filters={"id": self.payload.id})
            if not plane:
                return {'id': "Plane with this id already exists"}
        return None


async def validate_plane(payload: Union['PlaneBase', 'PlaneCreate']) -> List[Dict[str, str]] | None:
    validator_inst = PlaneValidator(payload)
    errors = await validator_inst.validate()
    if errors:
        return errors
    return None
