from pydantic import BaseModel, ConfigDict


class VideoTypeBase(BaseModel):
    name: str | None = None


class VideoTypeCreate(VideoTypeBase):
    pass


class VideoTypeUpdate(VideoTypeBase):
    pass


class VideoTypeRead(VideoTypeBase):
    limit: int = 100
    offset: int = 0


class VideoType(VideoTypeBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
