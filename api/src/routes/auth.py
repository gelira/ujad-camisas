from fastapi import APIRouter, HTTPException, status

from src.authentication import CurrentUser
from src.database import DbSession
from src.schemas.auth import (
    GenerateAuthCodeIn, GenerateAuthCodeOut, VerifyAuthCodeIn, VerifyAuthCodeOut, UserInfoOut
)
from src.services.auth_code import (
    get_valid_auth_code, new_auth_code, set_auth_codes_invalid
)
from src.services.token import create_access_token
from src.services.user import get_active_user_by_email


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/code", response_model=GenerateAuthCodeOut)
async def generate_auth_code(session: DbSession, body: GenerateAuthCodeIn):
    user = await get_active_user_by_email(session=session, email=body.email)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    auth_code = new_auth_code(user_id=user.id)

    session.add(auth_code)
    await session.flush()

    return auth_code


@router.post("/code/verify", response_model=VerifyAuthCodeOut)
async def verify_auth_code(session: DbSession, body: VerifyAuthCodeIn):
    auth_code = await get_valid_auth_code(
        session=session,
        uid=body.uid,
        code=body.code
    )

    if not auth_code:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_access_token(user_id=auth_code.user_id)

    await set_auth_codes_invalid(session=session, user_id=auth_code.user_id)

    return { "token": token }


@router.get("/me", response_model=UserInfoOut)
async def get_user_info(user: CurrentUser):
    return user