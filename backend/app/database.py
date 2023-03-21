from sqlalchemy.ext import declarative
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine


DATABASE_URL = "sqlite:///../database.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative.declarative_base()
