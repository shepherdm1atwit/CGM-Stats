"""
Stores User model that allows interfacing with the "users" table in the database, handles creating/making connections
to the database
"""

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
    """
    User object for getting information to/from database

    Note: egvs are stored and math is done in mg/dL units
    """
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

    #   -

    def verify_password(self, password: str):
        """ verifies user's password is correct
        :param password: hashed password
        :type password: str
        :return: True if password (once hashed by bcrypt.verify()) matches that of given user stored in database,
        False otherwise.
        :rtype: bool
        """

        return bcrypt.verify(password, self.hashed_password)


""" 
Runs on program start to create a local session connecting to the SQLite database (via sqlalchemy.orm.sessionmaker) if 
database exists. If not, creates database (including test user if configured), then create session connection.
"""
if not database_exists(engine.url):
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    email = settings.TEST_USER_EMAIL
    password = settings.TEST_USER_PASSWORD
    if email != "" and password != "":
        """
        Add user in database to avoid full account creation process during development/testing. Email can be changed to
        a real email or mailtrap can be set as SMTP Provider to test in app.config. If undesired, test email and 
        password can be left blank in config.
        """
        dbSession = SessionLocal()
        user = User(email=email, name="TestUser", hashed_password=bcrypt.hash(password), verified_email=True)
        dbSession.add(user)
        dbSession.commit()
else:
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
