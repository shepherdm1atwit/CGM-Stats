from fastapi import Depends, FastAPI, HTTPException, Request, security
from sqlalchemy.orm import Session
from config import settings
import services
import schemas
import requests
import models


app = FastAPI()


@app.get("/api")
async def root():
    return {"message": "CGM Stats"}


@app.post("/register")
async def create_user(user: schemas.CreateUser, request: Request, db: Session = Depends(services.get_db)):
    db_user = await services.get_user_by_email(user.email, db)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already in use")

    return await services.create_user(user=user, request=request, db=db)


@app.post("/token")
async def generate_token(form_data: security.OAuth2PasswordRequestForm = Depends(), db: Session = Depends(
    services.get_db)):
    user = await services.authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    return await services.create_token(user)


@app.get("/me", response_model=schemas.User)
async def get_user(user: schemas.User = Depends(services.get_current_user)):
    return user


@app.get("/dexconnected")
async def check_user_dex_connection(user: schemas.User = Depends(services.get_current_user), db: Session = Depends(services.get_db)):
    return await services.check_dexcom_connection(user=user, db=db)


@app.post("/authdexcom")
async def authenticate_dexcom(authcode: schemas.DexcomAuthCode, user: schemas.User = Depends(services.get_current_user), db: Session = Depends(services.get_db)):
    try:
        url = settings.DEXCOM_URL+"v2/oauth2/token"

        payload = {
            "grant_type": "authorization_code",
            "code": authcode.code,
            "redirect_uri": "http://" + settings.HOST_DOMAIN,
            "client_id": settings.DEXCOM_CLIENT_ID,
            "client_secret": settings.DEXCOM_CLIENT_SECRET
        }

        headers = {"Content-Type": "application/x-www-form-urlencoded"}

        response = requests.post(url, data=payload, headers=headers)

        data = response.json()
    except:
        raise HTTPException(
            status_code=500, detail="Error sending authentication request"
        )

    try:
        user = db.query(models.User).get(user.id)
        user.dex_access_token = data["access_token"]
        user.dex_refresh_token = data["refresh_token"]
        db.commit()
    except:
        raise HTTPException(
            status_code=500, detail="Error inserting access/refresh token into user in database"
        )

    return {"status": "success"}

@app.delete('/disconnectdexcom')
async def disconnect_dexcom(user: schemas.User = Depends(services.get_current_user), db: Session = Depends(services.get_db)):
    db_user = db.query(models.User).get(user.id)
    try:
        db_user.dex_access_token = None
        db_user.dex_refresh_token = None
        db.commit()
    except:

        raise HTTPException(
            status_code=500, detail="Error removing dexcom tokens from database"
        )
    return {"Status": "Dexcom account successfully disconnected."}

@app.post('/verifyemail')
async def verify_me(token: schemas.VerifyEmail, db: Session = Depends(services.get_db)):
    return await services.verify_email(token=token.token, db=db)


@app.post('/resetrequest')
async def reset_request(email: schemas.ForgotPassEmail, request: Request, db: Session = Depends(services.get_db)):
    return await services.send_password_reset(email=email.email, request=request, db=db)


@app.post('/resetpassword')
async def reset_password(msg: schemas.ResetPass, db: Session = Depends(services.get_db)):
    return await services.change_password(token=msg.token, password=msg.password, db=db)
