from pydantic import BaseModel


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
    token: str
    code: str


class VerifyEmail(BaseModel):
    token: str


class ForgotPassEmail(BaseModel):
    email: str


class ResetPass(BaseModel):
    token: str
    password: str
