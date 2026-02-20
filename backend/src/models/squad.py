from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Text
from .base import Base
from .squad_plane import SquadPlaneAssociation
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from .plane import Plane

class Squad(Base):
    __tablename__ = "squads"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(Text, nullable=True)

    # Relationship
    planes: Mapped[List["Plane"]] = relationship(secondary=SquadPlaneAssociation.__table__, back_populates="squads")
