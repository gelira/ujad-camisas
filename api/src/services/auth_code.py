import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import select, update

from src.database import DbSession
from src.models import AuthCode
from src.utils import generate_random_digits_sequence


AUTH_CODE_EXPIRATION_SECONDS = 15 * 60


def new_auth_code(*, user_id: int) -> AuthCode:
    code = generate_random_digits_sequence()

    now = datetime.now(timezone.utc)

    return AuthCode(
        code=code,
        user_id=user_id,
        expired_at=now + timedelta(seconds=AUTH_CODE_EXPIRATION_SECONDS),
    )


async def get_valid_auth_code(
        *,
        session: DbSession,
        uid: uuid.UUID,
        code: str
) -> AuthCode | None:
    statement = select(AuthCode).where(
        AuthCode.uid == uid,
        AuthCode.code == code,
        AuthCode.active.is_(True),
        AuthCode.expired_at > datetime.now(timezone.utc),
    )
    result = await session.execute(statement)

    return result.scalar_one_or_none()


async def set_auth_codes_invalid(
        *,
        session: DbSession,
        user_id: int,
) -> None:
    await session.execute(
        update(AuthCode).where(
            AuthCode.user_id == user_id,
            AuthCode.active.is_(True)
        ).values(active=False)
    )
