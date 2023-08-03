import database
from database import User as dbUser
import schemas
import jwt
import requests
from fastapi import Depends, security, HTTPException, Request
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from config import settings
from passlib.hash import bcrypt
from random import randbytes
from pydantic import EmailStr
from email_utils import Email
from hashlib import sha256

oauth2schema = security.OAuth2PasswordBearer(tokenUrl="/token")

JWT_SECRET = settings.JWT_PRIVATE_KEY
JWT_EXP_MINUTES = settings.JWT_EXP_MINUTES


def get_db():
    """
    Connects to database using SessionLocal, the sessionmaker created in database.py, closes once complete
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


async def generate_email(db_user: dbUser, topic: str, request: Request):
    """
    Generates token, builds link, and generates/sends email used for account verification and password reset links. Also
    updates verification code for user in database.

    :param db_user: user email is to be sent to
    :type db_user: database.User
    :param topic: topic of email (password_reset or verify_email)
    :type topic: string
    :param request: API request, used to get url scheme (http:// or https://) for verification/reset link
    :type request: Request
    """
    token = randbytes(10)
    hashed_code = sha256()
    hashed_code.update(token)
    verification_code = hashed_code.hexdigest()

    db_user.verification_code = verification_code

    user_dict = {"email": db_user.email, "name": db_user.name}

    if topic == "password_reset":
        url = f"{request.url.scheme}://{settings.HOST_DOMAIN}/resetpassword/{token.hex()}"
        await Email(user_dict, url, [EmailStr(db_user.email)]).sendResetCode()
    elif topic == "verify_email":
        url = f"{request.url.scheme}://{settings.HOST_DOMAIN}/verifyemail/{token.hex()}"
        await Email(user_dict, url, [EmailStr(db_user.email)]).sendVerificationCode()


async def send_password_reset(email: str, request: Request, db: Session):
    """
    Checks that user exists and has verified email address, if so, calls generate_email to send password reset email.

    :param email: email given in "reset password" prompt
    :type email: string
    :param request: api request for passing to generate_email
    :type request: Request
    :param db: database connection to use
    :type db: Session
    :return: status message
    :rtype: {string: string}
    """
    db_user = db.query(dbUser).filter_by(email=email).filter(dbUser.verified_email == True).first()
    if db_user is None:
        return {"status": "success"}

    try:
        await generate_email(db_user=db_user, topic="password_reset", request=request)
        db.commit()
        db.refresh(db_user)

    except Exception:
        raise HTTPException(
            status_code=500, detail='Error sending verification email')

    return {"status": "success"}


async def change_password(token: str, password: str, db: Session):
    """
    Finds user with verification_code matching given "token" from password reset link and changes password to new
    password in database, or throw error if it matches no user.

    :param token: token from reset link
    :type token: string
    :param password: new password to set
    :type password: string
    :param db: database connection to use
    :type db: Session
    :return: status message or throw error
    :rtype: {string: string}
    """

    hashed_code = sha256()
    hashed_code.update(bytes.fromhex(token))
    verification_code = hashed_code.hexdigest()

    user = db.query(dbUser).filter(dbUser.verification_code == verification_code).first()

    if not user:
        raise HTTPException(
            status_code=403, detail='Invalid password reset code')
    else:
        user.verification_code = None
        user.hashed_password = bcrypt.hash(password)
        db.commit()
        return {"status": "success"}


async def create_user(user: schemas.CreateUser, request: Request, db: Session):
    # TODO: DOCUMENTATION HERE
    user = dbUser(
        email=user.email, name=user.name, hashed_password=bcrypt.hash(user.hashed_password)
    )
    db.add(user)
    db.commit()

    db_user = db.query(dbUser).filter_by(email=user.email).filter(dbUser.verified_email == False).first()

    try:
        await generate_email(db_user=db_user, topic="verify_email", request=request)
        db.commit()

    except Exception:
        db.refresh(db_user)
        if db_user:
            db.delete(db_user)
            db.commit()
        raise HTTPException(status_code=500, detail="Error sending verification email, account not created.")

    return {"status": "success"}


async def verify_email(token: str, db: Session):
    # TODO: DOCUMENTATION HERE
    hashed_code = sha256()
    hashed_code.update(bytes.fromhex(token))
    verification_code = hashed_code.hexdigest()

    user = db.query(dbUser).filter(dbUser.verification_code == verification_code).first()

    if not user:
        raise HTTPException(
            status_code=403, detail='Invalid verification code or account already verified')
    else:
        user.verification_code = None
        user.verified_email = True
        db.commit()
        return {"status": "success"}


async def authenticate_user(email: str, password: str, db: Session):
    # TODO: DOCUMENTATION HERE
    user = await get_user_by_email(db=db, email=email)

    if user is not None and user.verify_password(password) and user.verified_email:
        return user
    return False


async def create_jwt_token(user: dbUser):
    # TODO: DOCUMENTATION HERE
    user = schemas.User.from_orm(user)
    payload = user.dict()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=JWT_EXP_MINUTES)
    token = jwt.encode(payload, JWT_SECRET)

    return dict(access_token=token, token_type="bearer")


async def get_current_user(
        db: Session = Depends(get_db),
        token: str = Depends(oauth2schema),
):
    # TODO: DOCUMENTATION HERE
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
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


async def check_dexcom_connection(request: Request, user: schemas.User, db: Session):
    # TODO: DOCUMENTATION HERE
    try:
        db_user = db.query(dbUser).get(user.id)
        url = settings.DEXCOM_URL + "v3/users/self/devices"
        headers = {"Authorization": f"Bearer {db_user.dex_access_token}"}
        response = requests.get(url, headers=headers)
        data = response.json()
        if "fault" in data:
            await refresh_dexcom_tokens(request=request, db_user=db_user, db=db)
            db.refresh(db_user)
            headers = {"Authorization": f"Bearer {db_user.dex_access_token}"}
            response = requests.get(url, headers=headers)
            data = response.json()
            if "fault" not in data:
                return True
            return False
        return True
    except:
        print("check_dexcom....")
        raise HTTPException(status_code=500, detail="Problem checking dexcom connection.")


async def refresh_dexcom_tokens(request: Request, db_user: dbUser, db: Session):
    # TODO: DOCUMENTATION HERE
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


# Add user in database to avoid full account creation process during development/testing.
# Email can be changed to a real email or mailtrap can be set as SMTP Provider to test.
def create_test_user():
    # TODO: DOCUMENTATION HERE
    email = settings.TEST_USER_EMAIL
    password = settings.TEST_USER_PASSWORD
    if email != "" and password != "":
        db = next(get_db())
        user = dbUser(email=email, name="TestUser", hashed_password=bcrypt.hash(password), verified_email=True)
        db.add(user)
        db.commit()
