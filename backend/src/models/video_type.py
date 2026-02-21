from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String
from .base import Base


class VideoType(Base):
    __tablename__ = "video_type"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=True)
