from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey
from .base import Base

if TYPE_CHECKING:
    from .drone_type import DroneType
    from .communication_type import CommunicationType
    from .squad import Squad
    from .video_type import VideoType

class Plane(Base):
    __tablename__ = "planes"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=True, unique=True)
    type: Mapped[int] = mapped_column(ForeignKey("drones_type.id"), nullable=True)
    communication: Mapped[int] = mapped_column(ForeignKey("communication_type.id"), nullable=True)
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)

    video_type_id: Mapped[int] = mapped_column(ForeignKey("video_type.id"), nullable=True)

    # Relationships
    drone_type: Mapped["DroneType"] = relationship()
    communication_type: Mapped["CommunicationType"] = relationship()
    video_type: Mapped["VideoType"] = relationship()
    squads: Mapped[list["Squad"]] = relationship(secondary="squad_plane_association", back_populates="planes")
