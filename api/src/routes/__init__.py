from fastapi import APIRouter

from .auth import router as auth_router
from .shirt_designs import router as shirt_designs_router
from .shirt_sizes import router as shirt_sizes_router


router = APIRouter(prefix="/api")
router.include_router(auth_router)
router.include_router(shirt_designs_router)
router.include_router(shirt_sizes_router)
