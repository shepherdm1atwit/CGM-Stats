from sqlalchemy import Column, String, Integer, Boolean
from passlib.hash import bcrypt
from database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    verification_code = Column(String, default=None)
    verified_email = Column(Boolean, default=False)
    #

    def verify_password(self, password: str):
        return bcrypt.verify(password, self.hashed_password)
