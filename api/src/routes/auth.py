from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from src.authentication import CurrentUser, create_access_token
from src.database import DbSession
from src.models import AuthCode, User
from src.schemas.auth import (
    GenerateAuthCodeIn, GenerateAuthCodeOut, VerifyAuthCodeIn, VerifyAuthCodeOut, UserInfoOut
)
from src.utils import generate_random_digits_sequence


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/code", response_model=GenerateAuthCodeOut)
async def generate_auth_code(session: DbSession, body: GenerateAuthCodeIn):
    result = await session.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    code = generate_random_digits_sequence()

    auth_code = AuthCode(
        code=code,
        user_id=user.id,
        expired_at=datetime.now(timezone.utc) + timedelta(minutes=15),
    )

    session.add(auth_code)
    await session.flush()

    return auth_code

@router.post("/code/verify", response_model=VerifyAuthCodeOut)
async def verify_auth_code(session: DbSession, body: VerifyAuthCodeIn):
    result = await session.execute(
        select(AuthCode).where(
            AuthCode.uid == body.uid,
            AuthCode.code == body.code,
            AuthCode.active == True,
            AuthCode.expired_at > datetime.now(timezone.utc),
        )
    )
    auth_code = result.scalar_one_or_none()

    if not auth_code:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_access_token(user_id=auth_code.user_id)

    auth_code.active = False

    session.add(auth_code)

    return { "token": token }

@router.get("/me", response_model=UserInfoOut)
async def get_user_info(user: CurrentUser):
    return user