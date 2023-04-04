import database
import models
import schemas
import jwt
import requests
from fastapi import Depends, security, HTTPException, Request
from sqlalchemy.orm import Session
from config import settings
from passlib.hash import bcrypt
from random import randbytes
from pydantic import EmailStr
from email_utils import Email
from hashlib import sha256

oauth2schema = security.OAuth2PasswordBearer(tokenUrl="/token")

JWT_SECRET = settings.JWT_PRIVATE_KEY


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_user_by_email(email: str, db: Session):
    return db.query(models.User).filter(models.User.email == email).first()


async def get_user_by_token(token: str, db: Session):
    return db.query(models.User).filter(models.User.email == email).first()


async def generate_email(db_user: models.User, topic: str, request: Request):
    token = randbytes(10)
    hashed_code = sha256()
    hashed_code.update(token)
    verification_code = hashed_code.hexdigest()

    db_user.verification_code = verification_code

    user_dict = {"email": db_user.email, "name": db_user.name}

    domain = settings.HOST_DOMAIN

    if topic == "password_reset":
        url = f"{request.url.scheme}://{domain}/resetpassword/{token.hex()}"
        return await Email(user_dict, url, [EmailStr(db_user.email)]).sendResetCode()
    elif topic == "verify_email":
        url = f"{request.url.scheme}://{domain}/verifyemail/{token.hex()}"
        return await Email(user_dict, url, [EmailStr(db_user.email)]).sendVerificationCode()


async def send_password_reset(email: str, request: Request, db: Session):
    db_user = db.query(models.User).filter_by(email=email).filter(models.User.verified_email == True).first()
    if db_user is None:
        return {"status": "success"}

    try:
        await generate_email(db_user=db_user, topic="password_reset", request=request)
        db.commit()
        db.refresh(db_user)

    except Exception as error:
        raise HTTPException(
            status_code=500, detail='Error sending verification email')

    return {"status": "success"}


async def change_password(token: str, password: str, db: Session):
    hashed_code = sha256()
    hashed_code.update(bytes.fromhex(token))
    verification_code = hashed_code.hexdigest()

    user = db.query(models.User).filter(models.User.verification_code == verification_code).first()

    if not user:
        raise HTTPException(
            status_code=403, detail='Invalid password reset code')
    else:
        user.verification_code = None
        user.hashed_password = bcrypt.hash(password)
        db.commit()
        return {"status": "success"}


async def create_user(user: schemas.CreateUser, request: Request, db: Session):
    user = models.User(
        email=user.email, name=user.name, hashed_password=bcrypt.hash(user.hashed_password)
    )
    db.add(user)
    db.commit()

    db_user = db.query(models.User).filter_by(email=user.email).filter(models.User.verified_email == False).first()

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
    hashed_code = sha256()
    hashed_code.update(bytes.fromhex(token))
    verification_code = hashed_code.hexdigest()

    user = db.query(models.User).filter(models.User.verification_code == verification_code).first()

    if not user:
        raise HTTPException(
            status_code=403, detail='Invalid verification code or account already verified')
    else:
        user.verification_code = None
        user.verified_email = True
        db.commit()
        return {"status": "success"}


async def authenticate_user(email: str, password: str, db: Session):
    user = await get_user_by_email(db=db, email=email)

    if not user:
        return False

    if not user.verify_password(password):
        return False

    if not user.verified_email:
        return False

    return user


async def create_token(user: models.User):
    db_user = schemas.User.from_orm(user)

    token = jwt.encode(db_user.dict(), JWT_SECRET)

    return dict(access_token=token, token_type="bearer")


async def check_dexcom_connection(user: schemas.User, db: Session):
    try:
        db_user = db.query(models.User).get(user.id)
        url = settings.DEXCOM_URL + "v3/users/self/devices"
        headers = {"Authorization": f"Bearer {db_user.dex_access_token}"}
        response = requests.get(url, headers=headers)
        data = response.json()
        if "fault" in data:
            try:
                await refresh_dexcom_tokens(db_user=db_user, db=db)
            except:
                return False
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


async def refresh_dexcom_tokens(db_user: models.User, db: Session):
    try:
        url = settings.DEXCOM_URL + "v2/oauth2/token"
        payload = {
            "grant_type": "refresh_token",
            "refresh_token": db_user.dex_refresh_token,
            "redirect_uri": "http://" + settings.HOST_DOMAIN,
            "client_id": settings.DEXCOM_CLIENT_ID,
            "client_secret": settings.DEXCOM_CLIENT_SECRET
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        response = requests.post(url, data=payload, headers=headers)
        data = response.json()
    except:
        print("refresh_dexcom....")
        raise HTTPException(status_code=500, detail="Error refreshing tokens.")
    if "error" in data:
        print("refresh_dexcom.... error in data")
        raise HTTPException(status_code=500, detail="Error refreshing tokens.")
    db_user.dex_access_token = data["access_token"]
    db_user.dex_refresh_token = data["refresh_token"]
    db.commit()


async def get_current_user(
        db: Session = Depends(get_db),
        token: str = Depends(oauth2schema),
):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(models.User).get(payload["id"])
    except:
        raise HTTPException(
            status_code=401, detail="Invalid Email or Password"
        )

    return schemas.User.from_orm(user)


def create_database():
    return database.Base.metadata.create_all(bind=database.engine)
