from pydantic import BaseModel, ConfigDict
from src.const import CommunicationType as CommunicationTypeCons

class CommunicationTypeBase(BaseModel):
    name: str | None = None

class CommunicationTypeCreate(CommunicationTypeBase):
    pass

class CommunicationTypeUpdate(CommunicationTypeBase):
    pass

class CommunicationType(CommunicationTypeBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class CommunicationTypeRead(BaseModel):
    name: str | None = None
    limit: int = 100
    offset: int = 0
    order_by: list[str] = [CommunicationTypeCons.NAME]
