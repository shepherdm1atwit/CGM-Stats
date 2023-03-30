from sqlalchemy import Column, String, Integer, Boolean
from passlib.hash import bcrypt
from database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    verification_code = Column(String, default=None)
    verified_email = Column(Boolean, default=False)

    # dex_access_token = Column(String, default=None)
    # dex_refresh_token = Column(String, default=None)
    #  -don't need to store authorization code, only used once and only valid for a minute, just receive it by correct
    #   endpoint, make request in that endpoint, store resulting access/refresh tokens

    # pref_gluc_max = Column(String, default=None)
    # pref_gluc_min = Column(String, default=None)
    #   -BLOOD GLUCOSE VALUES STORED/MATH DONE IN mg/dL, (add ability to convert viewed values to mmol/L?)
    #   -mg/dL in mmol/L, conversion factor: 1 mg/dL = 0.0555 mmol/L

    def verify_password(self, password: str):
        return bcrypt.verify(password, self.hashed_password)
