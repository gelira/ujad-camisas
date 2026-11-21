import os
from collections.abc import AsyncGenerator
from typing import Annotated

from fastapi.params import Depends
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:abc123@localhost:5432/teste",
)

DB_ECHO = bool(os.getenv("DB_ECHO"))
DB_POOL_SIZE = int(os.getenv("DB_POOL_SIZE", "10"))
DB_MAX_OVERFLOW = int(os.getenv("DB_MAX_OVERFLOW", "20"))

engine = create_async_engine(
    DATABASE_URL,
    echo=DB_ECHO,
    pool_size=DB_POOL_SIZE,
    max_overflow=DB_MAX_OVERFLOW,
    pool_pre_ping=True,
)

async_session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autoflush=False,
)

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
            
DbSession = Annotated[AsyncSession, Depends(get_session)]