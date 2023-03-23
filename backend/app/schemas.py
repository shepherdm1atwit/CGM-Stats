from pydantic import BaseModel


class UserBase(BaseModel):
    email: str


class CreateUser(UserBase):
    hashed_password: str

    class Config:
        orm_mode = True


class User(UserBase):
    id: int

    class Config:
        orm_mode = True


class VerifyEmail(BaseModel):
    token: str


class ForgotPassEmail(BaseModel):
    email: str


class ResetPass(BaseModel):
    token: str
    password: str
