from fastapi import Depends, FastAPI, HTTPException, Request, security
from sqlalchemy.orm import Session
from config import settings
import services
import schemas
import requests
from database import User as dbUser
import datetime

app = FastAPI()


@app.get("/api")
async def root():
    return {"message": "CGM Stats"}


#############################
# CGM-Stats User Management #
#############################


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


@app.post('/verifyemail')
async def verify_me(token: schemas.VerifyEmail, db: Session = Depends(services.get_db)):
    return await services.verify_email(token=token.token, db=db)


@app.post('/resetrequest')
async def reset_request(email: schemas.ForgotPassEmail, request: Request, db: Session = Depends(services.get_db)):
    return await services.send_password_reset(email=email.email, request=request, db=db)


@app.post('/resetpassword')
async def reset_password(msg: schemas.ResetPass, db: Session = Depends(services.get_db)):
    return await services.change_password(token=msg.token, password=msg.password, db=db)


@app.post('/savepreferences')
async def save_preferences(preferences: schemas.UserPreferences,
                           user: schemas.User = Depends(services.get_current_user),
                           db: Session = Depends(services.get_db)):
    db_user = db.query(dbUser).get(user.id)
    try:
        db_user.pref_gluc_min = preferences.minimum
        db_user.pref_gluc_max = preferences.maximum
        db.commit()
    except:
        raise HTTPException(status_code=500, detail="Error updating preferences in database")
    return {"Status": "Success"}


# Potentially use this in UserContext?
@app.get('/getpreferences')
async def get_preferences(user: schemas.User = Depends(services.get_current_user),
                          db: Session = Depends(services.get_db)):
    db_user = db.query(dbUser).get(user.id)
    return schemas.UserPreferences(minimum=db_user.pref_gluc_min, maximum=db_user.pref_gluc_max)


##############################
# Dexcom account managmement #
##############################

@app.get("/dexconnected")
async def check_user_dex_connection(request: Request, user: schemas.User = Depends(services.get_current_user),
                                    db: Session = Depends(services.get_db)):
    return await services.check_dexcom_connection(request=request, user=user, db=db)


@app.post("/authdexcom")
async def authenticate_dexcom(request: Request, authcode: schemas.DexcomAuthCode,
                              user: schemas.User = Depends(services.get_current_user),
                              db: Session = Depends(services.get_db)):
    try:
        url = settings.DEXCOM_URL + "v2/oauth2/token"

        payload = {
            "grant_type": "authorization_code",
            "code": authcode.code,
            "redirect_uri": f'{request.url.scheme}://{settings.HOST_DOMAIN}',
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
        user = db.query(dbUser).get(user.id)
        user.dex_access_token = data["access_token"]
        user.dex_refresh_token = data["refresh_token"]
        db.commit()
    except:
        raise HTTPException(
            status_code=500, detail="Error inserting access/refresh token into user in database"
        )

    return {"status": "success"}


@app.delete('/disconnectdexcom')
async def disconnect_dexcom(user: schemas.User = Depends(services.get_current_user),
                            db: Session = Depends(services.get_db)):
    db_user = db.query(dbUser).get(user.id)
    try:
        db_user.dex_access_token = None
        db_user.dex_refresh_token = None
        db.commit()
    except:
        raise HTTPException(status_code=500, detail="Error removing dexcom tokens from database")
    return {"Status": "Dexcom account successfully disconnected."}


#############################
# Graphing ETC for frontend #
#############################


@app.get('/getcurrentglucose')
async def get_current_glucose(request: Request, user: schemas.User = Depends(services.get_current_user), db: Session = Depends(services.get_db)):
    db_user = db.query(dbUser).get(user.id)
    access_token = db_user.dex_access_token
    end_time = datetime.datetime.now()
    start_time = end_time - datetime.timedelta(hours=8)

    url = f"{settings.DEXCOM_URL}v3/users/self/egvs"

    query = {
        "startDate": start_time.isoformat(),
        "endDate": end_time.isoformat()
    }

    headers = {"Authorization": f"Bearer {access_token}"}

    response = requests.get(url, headers=headers, params=query)
    data = response.json()
    if "fault" in data:
        await services.refresh_dexcom_tokens(request=request, db_user=db_user, db=db)
        db.refresh(db_user)
        access_token = db_user.dex_access_token
        headers["Authorization"] = f"Bearer {access_token}"

        response = requests.get(url, headers=headers, params=query)
        data = response.json()

    if len(data["records"]) == 0:
        raise HTTPException(status_code=500, detail="no records found")
    return {"value": data["records"][-1]["value"], "trend": data["records"][-1]["trend"]}


@app.get('/getpastdayegvs')
async def get_past_day_egvs(request: Request, user: schemas.User = Depends(services.get_current_user), db: Session = Depends(services.get_db)):
    db_user = db.query(dbUser).get(user.id)
    access_token = db_user.dex_access_token
    end_time = datetime.datetime.now()
    start_time = end_time - datetime.timedelta(hours=24)

    url = f"{settings.DEXCOM_URL}v3/users/self/egvs"

    query = {
        "startDate": start_time.isoformat(),
        "endDate": end_time.isoformat()
    }

    headers = {"Authorization": f"Bearer {access_token}"}

    response = requests.get(url, headers=headers, params=query)
    data = response.json()
    if "fault" in data:
        await services.refresh_dexcom_tokens(request=request, db_user=db_user, db=db)
        db.refresh(db_user)
        access_token = db_user.dex_access_token
        headers["Authorization"] = f"Bearer {access_token}"

        response = requests.get(url, headers=headers, params=query)
        data = response.json()

    print(len(data["records"]))

    for record in data["records"]:
        pass

    if len(data["records"]) == 0:
        raise HTTPException(status_code=500, detail="no records found")

    #return {"value": data["records"][-1]["value"]}