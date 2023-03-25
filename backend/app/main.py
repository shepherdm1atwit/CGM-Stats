from fastapi import Depends, FastAPI, HTTPException, Request, security
from sqlalchemy.orm import Session
import services
import schemas

app = FastAPI()


@app.get("/api")
async def root():
    return {"message": "CGM Stats"}


@app.post("/register")
async def create_user(user: schemas.CreateUser, request: Request, db: Session = Depends(services.get_db)):
    db_user = await services.get_user_by_email(user.email, db)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already in use")

    print(user.dict())

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
