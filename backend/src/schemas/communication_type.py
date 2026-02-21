from pydantic import BaseModel, ConfigDict

class CommunicationTypeBase(BaseModel):
    name: str | None = None

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
