from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String
from .base import Base

class CommunicationType(Base):
    __tablename__ = "communication_type"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=True, unique=True)
