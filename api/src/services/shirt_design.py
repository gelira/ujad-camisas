from sqlalchemy import select

from src.database import DbSession
from src.models import ShirtDesign


async def get_shirt_designs(
        *,
        session: DbSession,
) -> list[ShirtDesign]:
    statement = select(ShirtDesign).order_by(ShirtDesign.description)
    result = await session.execute(statement)

    return result.scalars().all()
