from fastapi import Depends, security, HTTPException, Request
from sqlalchemy.orm import Session
import database
import models
import schemas
from config import settings
from passlib.hash import bcrypt
import jwt
from random import randbytes
from pydantic import EmailStr
from email_utils import Email
from hashlib import sha256

oauth2schema = security.OAuth2PasswordBearer(tokenUrl="/token")

JWT_SECRET = settings.JWT_PRIVATE_KEY


def create_database():
    return database.Base.metadata.create_all(bind=database.engine)


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_user_by_email(email: str, db: Session):
    return db.query(models.User).filter(models.User.email == email).first()


async def create_user(user: schemas.CreateUser, request: Request, db: Session):
    user = models.User(
        email=user.email, hashed_password=bcrypt.hash(user.hashed_password)
    )
    db.add(user)
    db.commit()

    db_user = db.query(models.User).filter_by(email=user.email).filter(models.User.verified_email == False).first()

    try:
        token = randbytes(10)
        hashedCode = sha256()
        hashedCode.update(token)
        verification_code = hashedCode.hexdigest()

        db_user.verification_code = verification_code
        user_dict = schemas.User.from_orm(user).dict()


        #TESTING ONLY
        #url = f"{request.url.scheme}://{request.client.host}:{request.url.port}/verifyemail/{token.hex()}"
        url = f"{request.url.scheme}://{request.client.host}:3000/verifyemail/{token.hex()}"

        await Email(user_dict, url, [EmailStr(db_user.email)]).sendVerificationCode()
        db.commit()
        db.refresh(db_user)

    except Exception as error:
        raise HTTPException(
            status_code=500, detail='Error sending verification email')

    return {"status": "success", "user": schemas.User.from_orm(user)}


async def verify_email(token: str, db: Session):
    hashedCode = sha256()
    hashedCode.update(bytes.fromhex(token))
    verification_code = hashedCode.hexdigest()

    user = db.query(models.User).filter(models.User.verification_code == verification_code).first()

    if not user:
        raise HTTPException(
            status_code=403, detail='Invalid verification code or account already verified')
    else:
        user.verification_code = None
        user.verified_email = True
        db.commit()
        return await create_token(user)




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
