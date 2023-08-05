"""
Schemas used for transporting data between client and server
"""

from pydantic import BaseModel
from pydantic.fields import Optional

""" Receives user information from client when new user registers """


class CreateUser(BaseModel):
    email: str
    name: str
    password: str

    class Config:
        orm_mode = True


""" Carries generic user id information """


class User(BaseModel):
    email: str
    name: str
    id: int

    class Config:
        orm_mode = True


""" Carries dexcom authorization code to connect accounts """


class DexcomAuthCode(BaseModel):
    code: str


""" Carries email verification token """


class VerifyEmail(BaseModel):
    token: str


""" Carries password reset verification token """


class ForgotPassEmail(BaseModel):
    email: str


""" Carries new password for changing password """


class ResetPass(BaseModel):
    token: str
    password: str


""" Transports user preferences to server when set, and to client within UserContext """


class UserPreferences(BaseModel):
    minimum: Optional[int]
    maximum: Optional[int]
