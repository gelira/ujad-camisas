from sqlalchemy import select

from src.database import DbSession
from src.models import User


async def get_active_user_by_id(
        *,
        session: DbSession,
        user_id: int
) -> User | None:
    statement = select(User).where(
        User.id == user_id,
        User.active.is_(True)
    )
    result = await session.execute(statement)

    return result.scalar_one_or_none()


async def get_active_user_by_email(
        *,
        session: DbSession,
        email: str
) -> User | None:
    statement = select(User).where(
        User.email == email,
        User.active.is_(True)
    )
    result = await session.execute(statement)

    return result.scalar_one_or_none()


