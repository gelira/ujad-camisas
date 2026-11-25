from fastapi import APIRouter

from src.authentication import AuthenticatedUserDependency
from src.database import DbSession
from src.schemas.shirt_sizes import ShirtSizeOut
from src.services.shirt_size import get_shirt_sizes


router = APIRouter(
    tags=["Shirt sizes"], 
    dependencies=[AuthenticatedUserDependency]
)


@router.get("/shirt-sizes", response_model=list[ShirtSizeOut])
async def list_shirt_sizes(session: DbSession):
    return await get_shirt_sizes(session=session)
