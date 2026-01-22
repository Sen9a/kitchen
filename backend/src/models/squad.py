from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Text, Integer, ForeignKey
from .base import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .plane import Plane

class Squad(Base):
    __tablename__ = "squads"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(Text, nullable=True)
    device: Mapped[int] = mapped_column(ForeignKey("planes.id"), nullable=True)

    # Relationship
    plane: Mapped["Plane"] = relationship()
