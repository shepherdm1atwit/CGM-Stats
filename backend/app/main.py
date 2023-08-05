"""
Main body of code for CGM Stats backend/server-side operation. Contains all custom API endpoints including user
management, dexcom connections, user preference management, and data manipulation before frontend visualization.
"""

from fastapi import Depends, FastAPI, HTTPException, Request, security
from sqlalchemy.orm import Session
from config import settings
import services
import schemas
import requests
from email_utils import Email
from database import User as dbUser
import calendar
from statistics import pstdev
from passlib.hash import bcrypt
from datetime import timedelta, datetime
import jwt
from hashlib import sha256

app = FastAPI()


# TODO: DOCUMENTATION HERE (whole file)

@app.get("/api")
async def root():
    """
    simple ping-pong endpoint to ensure client has connection to server.

    :return: "CGM Stats"
    :rtype: dict (json)
    """
    return {"message": "CGM Stats"}


###############################
### User Management section ###
###############################


@app.post("/register")
async def register_user(user: schemas.CreateUser, request: Request, db: Session = Depends(services.get_db)):
    """
    Creates a new user in the database if email is not already in use, then sends verification code. Removes created
    user if verification email fails to send so as not to lock that email out forever.

    :param user: username/password information filled in on frontend
    :type user: schemas.CreateUser
    :param request: request sent by frontend
    :type request: Request
    :param db: database connection session to use
    :type db: Session
    :return: throws error or returns status success message
    :rtype: {string: string}
    """

    db_user = await services.get_user_by_email(user.email, db)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already in use")

    new_user = dbUser(
        email=user.email, name=user.name, hashed_password=bcrypt.hash(user.password)
    )
    db.add(new_user)
    db.commit()

    db_user = db.query(dbUser).filter_by(email=user.email).filter(dbUser.verified_email == False).first()

    try:
        await Email(db_user=db_user, topic="verify_email", request=request).send()
        db.commit()

    except Exception:
        db.refresh(db_user)
        if db_user:
            db.delete(db_user)
            db.commit()
        raise HTTPException(status_code=500, detail="Error sending verification email, account not created.")

    return {"status": "success"}


@app.post("/token")
async def generate_token(form_data: security.OAuth2PasswordRequestForm = Depends(), db: Session = Depends(
    services.get_db)):
    """
    Generates and sends client jwt authentication token (assuming username/password from
    security.OAuth2PasswordRequestForm is correct), else throws 401 unauthorized error

    :param form_data: email/password form data from client
    :type form_data: security.OAuth2PasswordRequestForm
    :param db: database connection session to use
    :type db: Session
    :return: dictionary (json) of access token and token_type="bearer"
    :rtype: dict
    """
    db_user = await services.get_user_by_email(db=db, email=form_data.username)

    if db_user is not None and db_user.verify_password(form_data.password) and db_user.verified_email:
        user = schemas.User.from_orm(db_user)
        payload = user.dict()
        payload["exp"] = datetime.utcnow() + timedelta(minutes=settings.JWT_EXP_MINUTES)
        token = jwt.encode(payload, settings.JWT_PRIVATE_KEY)

        return dict(access_token=token, token_type="bearer")


    else:
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    return await services.create_jwt_token(user)


@app.get("/me")
async def get_user(user: schemas.User = Depends(services.get_current_user)):
    """
    Returns user information upon request.

    :param user: user whose information is being requested
    :type user: schemas.User
    :return: requested user information
    :rtype: schemas.User
    """
    return user


@app.post('/verifyemail')
async def verify_me(token: schemas.VerifyEmail, db: Session = Depends(services.get_db)):
    hashed_code = sha256()
    hashed_code.update(bytes.fromhex(token.token))
    verification_code = hashed_code.hexdigest()

    db_user = db.query(dbUser).filter(dbUser.verification_code == verification_code).first()

    if not db_user:
        raise HTTPException(
            status_code=403, detail='Invalid verification code or account already verified')
    else:
        db_user.verification_code = None
        db_user.verified_email = True
        db.commit()
        return {"status": "success"}


@app.post('/resetrequest')
async def reset_request(email: schemas.ForgotPassEmail, request: Request, db: Session = Depends(services.get_db)):
    """
    Checks that user exists and has verified email address, if so, sends password reset email trhough email_utils.Email.

    :param email: email given in "reset password" prompt
    :type email: string
    :param request: api request for passing to email generation
    :type request: Request
    :param db: database connection to use
    :type db: Session
    :return: status message
    :rtype: {string: string}
    """
    db_user = db.query(dbUser).filter_by(email=email.email).filter(dbUser.verified_email == True).first()
    if db_user is None:
        return {"status": "success"}

    try:
        await Email(db_user=db_user, topic="reset_password", request=request).send()
        db.commit()
        db.refresh(db_user)

    except Exception:
        raise HTTPException(
            status_code=500, detail='Error sending verification email')

    return {"status": "success"}


@app.post('/resetpassword')
async def reset_password(msg: schemas.ResetPass, db: Session = Depends(services.get_db)):
    """
    Finds user with verification_code matching given "token" from password reset link and changes password to new
    password in database, or throw error if it matches no user.

    :param msg: message containing token to authenticate/identify user and new password to change to
    :type msg: schemas.ResetPass
    :param db: database connection to use
    :type db: Session
    :return: status message or throw error
    :rtype: {string: string}
    """

    hashed_code = sha256()
    hashed_code.update(bytes.fromhex(msg.token))
    verification_code = hashed_code.hexdigest()

    db_user = db.query(dbUser).filter(dbUser.verification_code == verification_code).first()

    if not db_user:
        raise HTTPException(
            status_code=403, detail='Invalid password reset code')
    else:
        db_user.verification_code = None
        db_user.hashed_password = bcrypt.hash(msg.password)
        db.commit()
        return {"status": "success"}


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


@app.delete('/deletepreferences')
async def delete_preferences(user: schemas.User = Depends(services.get_current_user),
                             db: Session = Depends(services.get_db)):
    db_user = db.query(dbUser).get(user.id)
    try:
        db_user.pref_gluc_max = None
        db_user.pref_gluc_min = None
        db.commit()
    except:
        raise HTTPException(status_code=500, detail="Error removing preferences from database")
    return {"Status": "Preferences successfully cleared."}


##################################
### Dexcom account managmement ###
##################################

@app.get("/dexconnected")
async def check_dexcom_connection(request: Request, user: schemas.User = Depends(services.get_current_user),
                                  db: Session = Depends(services.get_db)):
    """
    Checks if given user has a connected dexcom account. if access token is expired, will attempt to get new access
    token through refresh_dexcom_tokens, then try again.

    :param request: request from client
    :type request: Request
    :param user: current user (passed by api endpoint)
    :type user: schemas.User
    :param db: database connection session to use
    :type db: Session
    :return: throws error if error occurs in refresh_dexcom_tokens, else returns True if user has connected dexcom
    account in database, False if not.
    :rtype: bool
    """
    try:
        db_user = db.query(dbUser).get(user.id)
        url = settings.DEXCOM_URL + "v3/users/self/devices"
        headers = {"Authorization": f"Bearer {db_user.dex_access_token}"}
        response = requests.get(url, headers=headers)
        data = response.json()
        if "fault" in data:
            await services.refresh_dexcom_tokens(request=request, db_user=db_user, db=db)
            db.refresh(db_user)
            headers = {"Authorization": f"Bearer {db_user.dex_access_token}"}
            response = requests.get(url, headers=headers)
            data = response.json()
            if "fault" not in data:
                return True
            return False
        return True
    except:
        raise HTTPException(status_code=500, detail="Problem checking dexcom connection.")


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


#########################################
### Visualization information section ###
#########################################


@app.get('/getcurrentglucose')
async def get_current_glucose(request: Request, user: schemas.User = Depends(services.get_current_user),
                              db: Session = Depends(services.get_db)):
    db_user = db.query(dbUser).get(user.id)
    access_token = db_user.dex_access_token
    end_time = datetime.now()
    start_time = end_time - timedelta(hours=8)

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
    record = data["records"][0]
    date_time = datetime.strptime(record["systemTime"], '%Y-%m-%dT%H:%M:%SZ')
    return {"value": record["value"], "trend": record["trend"], "timestamp": date_time.isoformat() + ".000Z"}


@app.get('/getpastdayegvs')
async def get_past_day_egvs(request: Request, user: schemas.User = Depends(services.get_current_user),
                            db: Session = Depends(services.get_db)):
    db_user = db.query(dbUser).get(user.id)
    access_token = db_user.dex_access_token
    end_time = datetime.now()
    start_time = end_time - timedelta(hours=24)

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

    records = data["records"]

    if len(records) == 0:
        raise HTTPException(status_code=500, detail="no records found")

    xy_pairs = []

    date_time = datetime.strptime(records[0]["systemTime"], '%Y-%m-%dT%H:%M:%SZ')
    egv_sum = 0
    egv_count = 0

    for num_record, record in enumerate(records):
        record_date_time = datetime.strptime(record["systemTime"], '%Y-%m-%dT%H:%M:%SZ')
        if record_date_time.hour == date_time.hour:
            egv_sum += record["value"]
            egv_count += 1
        else:
            xy_pairs.append({"x": date_time.isoformat() + ".000Z", "y": round(egv_sum / egv_count)})
            date_time = record_date_time
            egv_sum = record["value"]
            egv_count = 1

    xy_pairs.reverse()
    return {"xy_pairs": xy_pairs}


# add ability to select timeframe/month?
@app.get('/getbestday')
async def get_best_day(request: Request, user: schemas.User = Depends(services.get_current_user),
                       db: Session = Depends(services.get_db)):
    db_user = db.query(dbUser).get(user.id)
    access_token = db_user.dex_access_token
    end_time = datetime.now() - timedelta(days=1)
    start_time = end_time - timedelta(days=30)

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

    records = data["records"]

    if len(records) == 0:
        raise HTTPException(status_code=500, detail="no records found")

    date_time = datetime.strptime(records[0]["systemTime"], '%Y-%m-%dT%H:%M:%SZ')
    date_vals = []

    lowest_std = None
    best_day = None

    for num_record, record in enumerate(records):
        record_date_time = datetime.strptime(record["systemTime"], '%Y-%m-%dT%H:%M:%SZ')
        if record_date_time.date() == date_time.date():
            date_vals.append(record["value"])
        else:
            date_std = pstdev(date_vals)
            if lowest_std is None or date_std < lowest_std:
                lowest_std = date_std
                best_day = date_time
            date_time = record_date_time
            date_vals = [record["value"]]

    xy_pairs = []

    best_day_date_time = None
    egv_sum = 0
    egv_count = 0

    for num_record, record in enumerate(records):
        record_date_time = datetime.strptime(record["systemTime"], '%Y-%m-%dT%H:%M:%SZ')
        if record_date_time.date() == best_day.date():
            if best_day_date_time is None:
                best_day_date_time = record_date_time
                egv_sum += record["value"]
                egv_count += 1
            elif record_date_time.hour == best_day_date_time.hour:
                egv_sum += record["value"]
                egv_count += 1
            else:
                xy_pairs.append({"x": best_day_date_time.isoformat() + ".000Z", "y": round(egv_sum / egv_count)})
                best_day_date_time = record_date_time
                egv_sum = record["value"]
                egv_count = 1

    xy_pairs.reverse()
    return {"best_day": best_day.isoformat(), "best_day_std": lowest_std, "xy_pairs": xy_pairs}


@app.get('/getpastdaypie')
async def get_past_day_pie(request: Request, user: schemas.User = Depends(services.get_current_user),
                           db: Session = Depends(services.get_db)):
    db_user = db.query(dbUser).get(user.id)
    pref_min = db_user.pref_gluc_min
    pref_max = db_user.pref_gluc_max

    if pref_min is None or pref_max is None:
        return {"values": []}

    access_token = db_user.dex_access_token
    end_time = datetime.now()
    start_time = end_time - timedelta(hours=24)

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

    records = data["records"]

    if len(records) == 0:
        raise HTTPException(status_code=500, detail="no records found")

    num_above = 0
    num_below = 0
    num_in_range = 0
    for record in records:
        if int(record["value"]) > int(pref_max):
            num_above += 1
        elif int(record["value"]) < int(pref_min):
            num_below += 1
        else:
            num_in_range += 1

    values = [((num_in_range / len(records)) * 100).__round__(), ((num_above / len(records)) * 100).__round__(),
              ((num_below / len(records)) * 100).__round__()]
    return {"values": values}


@app.get('/getpastweekboxplot')
async def get_box_plot(request: Request, user: schemas.User = Depends(services.get_current_user),
                       db: Session = Depends(services.get_db)):
    db_user = db.query(dbUser).get(user.id)
    access_token = db_user.dex_access_token
    end_time = datetime.now()
    start_time = end_time - timedelta(days=7)

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

    records = data["records"]

    if len(records) == 0:
        raise HTTPException(status_code=500, detail="no records found")

    records.reverse()
    val_by_day = [[], [], [], [], [], [], []]
    days = []
    current_date = start_time.date()
    days.append(calendar.day_name[current_date.weekday()])
    current_day_num = 0
    for record in records:
        record_date = datetime.strptime(record["systemTime"], '%Y-%m-%dT%H:%M:%SZ').date()

        if record_date == current_date:
            val_by_day[current_day_num].append(record["value"])
        else:
            current_date = record_date
            current_day_num += 1
            if current_day_num == 7:
                break
            val_by_day[current_day_num].append(record["value"])
            days.append(calendar.day_name[current_date.weekday()])

    return {"values": val_by_day, "days": days}
