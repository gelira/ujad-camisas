
import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class GenerateAuthCodeIn(BaseModel):
    email: EmailStr


class GenerateAuthCodeOut(BaseModel):
    uid: uuid.UUID
    expired_at: datetime


class VerifyAuthCodeIn(BaseModel):
    uid: uuid.UUID
    code: str = Field(pattern=r"^\d{6}$", description="Authentication code consisting of 6 digits")


class VerifyAuthCodeOut(BaseModel):
    token: str


class UserInfoOut(BaseModel):
    name: str
    email: str