from pydantic import BaseSettings, EmailStr


class Settings(BaseSettings):

    JWT_PRIVATE_KEY: str

    EMAIL_HOST: str
    EMAIL_PORT: int
    EMAIL_USERNAME: str
    EMAIL_PASSWORD: str
    EMAIL_FROM: EmailStr

    class Config:
        env_file = ".env"


settings = Settings()