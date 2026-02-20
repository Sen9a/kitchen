from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey
from .base import Base

class SquadPlaneAssociation(Base):
    __tablename__ = "squad_plane_association"

    squad_id: Mapped[int] = mapped_column(ForeignKey("squads.id"), primary_key=True)
    plane_id: Mapped[int] = mapped_column(ForeignKey("planes.id"), primary_key=True)
