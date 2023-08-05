"""
Handles retrieving/making available configuration information from config file on program start
"""

from pydantic import BaseSettings, EmailStr


class Settings(BaseSettings):
    """
    Pydantic BaseSettings object that retrieves values from specified env_file when created, then is imported elsewhere
     as 'config.settings'.
    """

    JWT_PRIVATE_KEY: str
    JWT_EXP_MINUTES: int

    HOST_DOMAIN: str

    DEXCOM_URL: str
    DEXCOM_CLIENT_ID: str
    DEXCOM_CLIENT_SECRET: str

    EMAIL_HOST: str
    EMAIL_PORT: int
    EMAIL_USERNAME: str
    EMAIL_PASSWORD: str
    EMAIL_FROM: EmailStr
    USE_TLS: bool

    TEST_USER_EMAIL: str
    TEST_USER_PASSWORD: str

    class Config:
        env_file = "app.config"


settings = Settings()
