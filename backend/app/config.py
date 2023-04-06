from pydantic import BaseSettings, EmailStr


class Settings(BaseSettings):

    JWT_PRIVATE_KEY: str

    HOST_DOMAIN: str

    DEXCOM_URL: str
    DEXCOM_CLIENT_ID: str
    DEXCOM_CLIENT_SECRET: str

    EMAIL_HOST: str
    EMAIL_PORT: int
    EMAIL_USERNAME: str
    EMAIL_PASSWORD: str
    EMAIL_FROM: EmailStr

    TEST_USER_EMAIL: str
    TEST_USER_PASSWORD: str

    class Config:
        env_file = "app.config"


settings = Settings()