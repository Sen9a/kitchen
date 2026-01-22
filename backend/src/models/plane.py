from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey
from .base import Base

if TYPE_CHECKING:
    from .drone_type import DroneType
    from .communication_type import CommunicationType

class Plane(Base):
    __tablename__ = "planes"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=True, unique=True)
    type: Mapped[int] = mapped_column(ForeignKey("drones_type.id"), nullable=True)
    communication: Mapped[int] = mapped_column(ForeignKey("communication_type.id"), nullable=True)
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)

    # Relationships
    drone_type: Mapped["DroneType"] = relationship()
    communication_type: Mapped["CommunicationType"] = relationship()
