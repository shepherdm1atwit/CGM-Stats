from pydantic import BaseModel
from pydantic.fields import Optional


class UserBase(BaseModel):
    email: str


class CreateUser(UserBase):
    name: str
    hashed_password: str

    class Config:
        orm_mode = True


class User(UserBase):
    name: str
    id: int

    class Config:
        orm_mode = True


class DexcomAuthCode(BaseModel):
    code: str


class VerifyEmail(BaseModel):
    token: str


class ForgotPassEmail(BaseModel):
    email: str


class ResetPass(BaseModel):
    token: str
    password: str


class UserPreferences(BaseModel):
    minimum: Optional[int]
    maximum: Optional[int]
