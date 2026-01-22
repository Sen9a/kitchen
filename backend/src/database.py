from contextlib import asynccontextmanager
from typing import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, AsyncEngine
from sqlalchemy.orm import sessionmaker

from src.settings import settings

engine: AsyncEngine = create_async_engine(
    settings.DB_URL,
    echo=getattr(settings, "DB_ECHO", False)
)

async_session_factory = sessionmaker(
    engine,
    expire_on_commit=False,
    class_=AsyncSession
)

@asynccontextmanager
async def get_db_session() -> AsyncIterator[AsyncSession]:
    """Provides a transactional scope around a series of operations."""

    async with async_session_factory() as session:
        async with session.begin():
            yield session