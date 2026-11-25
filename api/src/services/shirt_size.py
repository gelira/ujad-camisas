from sqlalchemy import select

from src.database import DbSession
from src.models import ShirtSize


async def get_shirt_sizes(
        *,
        session: DbSession,
) -> list[ShirtSize]:
    statement = select(ShirtSize).order_by(ShirtSize.order_to_show)
    result = await session.execute(statement)

    return result.scalars().all()
