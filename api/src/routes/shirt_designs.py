from fastapi import APIRouter

from src.authentication import AuthenticatedUserDependency
from src.database import DbSession
from src.schemas.shirt_designs import ShirtDesignOut
from src.services.shirt_design import get_shirt_designs


router = APIRouter(
    tags=["Shirt designs"], 
    dependencies=[AuthenticatedUserDependency]
)


@router.get("/shirt-designs", response_model=list[ShirtDesignOut])
async def list_shirt_designs(session: DbSession):
    return await get_shirt_designs(session=session)
