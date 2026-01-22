from pydantic import BaseModel, ConfigDict
from typing import Optional

class CommunicationTypeBase(BaseModel):
    name: Optional[str] = None

class CommunicationTypeCreate(CommunicationTypeBase):
    pass

class CommunicationTypeUpdate(CommunicationTypeBase):
    pass

class CommunicationTypeRead(CommunicationTypeBase):
    limit: int = 100
    offset: int = 0

class CommunicationType(CommunicationTypeBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
