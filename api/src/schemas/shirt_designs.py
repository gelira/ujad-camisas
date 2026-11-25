import uuid
from pydantic import BaseModel


class ShirtDesignOut(BaseModel):
    uid: uuid.UUID
    description: str
    value_in_cents: int
