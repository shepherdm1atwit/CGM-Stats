"""
This file contains a collection of common /services used commonly, repeatedly, or by multiple endpoints
"""

import database
from database import User as dbUser
import schemas
import jwt
import requests
from fastapi import Depends, security, HTTPException, Request
from sqlalchemy.orm import Session
from config import settings

""" Create schema for fastapi security module """
oauth2schema = security.OAuth2PasswordBearer(tokenUrl="/token")


def get_db():
    """
    Connects to database using SessionLocal (sessionmaker from database.py), yields resulting session, closes once
    complete
    """
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_user_by_email(email: str, db: Session):
    """
    Returns database.User object from database given user's email if found, or None if not.

    :param email: Email of the user to look up
    :type email: string
    :param db: database session to use to connect
    :type db: sqlalchemy session
    :return: found user or none if not found
    :rtype: database.User
    """
    return db.query(dbUser).filter(dbUser.email == email).first()


async def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2schema)):
    """
    Gets current user given user's JWT authentication token

    :param db: database connection session to use
    :type db: Session
    :param token: JWT token to decode/get user for
    :type token: string
    :return: User schema converted from database.User via schemas.User.from_orm()
    :rtype: schemas.User
    """
    try:
        payload = jwt.decode(token, settings.JWT_PRIVATE_KEY, algorithms=["HS256"])
        user = db.query(dbUser).get(payload["id"])
    except jwt.exceptions.ExpiredSignatureError:
        raise HTTPException(
            status_code=401, detail="Your session has expired."
        )
    except Exception:
        raise HTTPException(
            status_code=401, detail="Invalid Email or Password"
        )

    return schemas.User.from_orm(user)


async def refresh_dexcom_tokens(request: Request, db_user: dbUser, db: Session):
    """
    Given a request, a user database object, and a database session, refreshes dexcom access token using stored refresh
    token.

    :param request: request from client for url scheme (http/https) information
    :type request: Request
    :param db_user: user object from database
    :type db_user: database.User
    :param db: database connection session to use
    :type db: Session
    """
    try:
        url = settings.DEXCOM_URL + "v2/oauth2/token"
        payload = {
            "grant_type": "refresh_token",
            "refresh_token": db_user.dex_refresh_token,
            "redirect_uri": f'{request.url.scheme}://{settings.HOST_DOMAIN}',
            "client_id": settings.DEXCOM_CLIENT_ID,
            "client_secret": settings.DEXCOM_CLIENT_SECRET
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        response = requests.post(url, data=payload, headers=headers)
        data = response.json()
    except:
        raise HTTPException(status_code=500, detail="Error refreshing tokens.")
    if "error" in data:
        raise HTTPException(status_code=500, detail="Error refreshing tokens. - Error in data")
    db_user.dex_access_token = data["access_token"]
    db_user.dex_refresh_token = data["refresh_token"]
    db.commit()
