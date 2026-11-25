import uuid
from pydantic import BaseModel


class ShirtSizeOut(BaseModel):
    uid: uuid.UUID
    description: str
