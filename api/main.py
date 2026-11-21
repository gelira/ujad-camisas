from fastapi import FastAPI
from src.routes import router as api_router

app = FastAPI(
    title="Ujad Camisas API",
    description="API para o sistema de gerenciamento de camisas da Ujad.",
    version="0.1.0",
)

app.include_router(api_router)
