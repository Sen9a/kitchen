from pydantic import BaseModel, ConfigDict


class VideoTypeBase(BaseModel):
    name: str | None = None


class VideoTypeCreate(VideoTypeBase):
    pass


class VideoTypeUpdate(VideoTypeBase):
    pass


class VideoTypeRead(BaseModel):
    name: str | None = None
    limit: int = 100
    offset: int = 0
    order_by: list[str] = []


class VideoType(VideoTypeBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
