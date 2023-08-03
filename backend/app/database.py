from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, Column, String, Integer, Boolean
from sqlalchemy_utils import database_exists
from passlib.hash import bcrypt
from config import settings

""" URL/location of SQLite database file. """
DATABASE_URL = "sqlite:///../db/database.db"

""" Creates "engine" used to connect to the database, actual connection happens below """
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
Base = declarative_base()


class User(Base):
    """ User object for getting information to/from database """
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    verification_code = Column(String, default=None)
    verified_email = Column(Boolean, default=False)

    dex_access_token = Column(String, default=None)
    dex_refresh_token = Column(String, default=None)
    #  - don't need to store authorization code, only used once and only valid for a minute, just receive it by correct
    #    endpoint, make request in that endpoint, store resulting access/refresh tokens

    pref_gluc_max = Column(String, default=None)
    pref_gluc_min = Column(String, default=None)

    #   - BLOOD GLUCOSE VALUES STORED/MATH DONE IN mg/dL, (add ability to convert viewed values to mmol/L?)
    #   - mg/dL in mmol/L, conversion factor: 1 mg/dL = 0.0555 mmol/L

    def verify_password(self, password: str):
        """ verifies user's password is correct
        :param password: hashed password
        :type password: str
        :return:
        :rtype:
        """

        return bcrypt.verify(password, self.hashed_password)


""" 
Run on program start to create a local session connecting to the SQLite database if it exists, or create it, then 
create session connection if it does not.
Also creates test user if specified in app.config upon creating database.
"""
if not database_exists(engine.url):
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    email = settings.TEST_USER_EMAIL
    password = settings.TEST_USER_PASSWORD
    if email != "" and password != "":
        dbSession = SessionLocal()
        user = User(email=email, name="TestUser", hashed_password=bcrypt.hash(password), verified_email=True)
        dbSession.add(user)
        dbSession.commit()
else:
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
