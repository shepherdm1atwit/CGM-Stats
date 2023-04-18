from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from jinja2 import Environment, select_autoescape, FileSystemLoader
from pydantic import EmailStr, BaseModel
from config import settings
from typing import List

env = Environment(
    loader=FileSystemLoader(searchpath="./templates"),
    autoescape=select_autoescape(['html', 'xml'])
)


class EmailSchema(BaseModel):
    email: List[EmailStr]


class Email:
    def __init__(self, user: dict, url: str, email: List[EmailStr]):
        self.name = user['name']
        self.sender = 'CGM Stats <mailbot1248@gmail.com>'  # TODO: change this address to a real email
        self.email = email
        self.url = url
        pass

    async def sendMail(self, subject, template):
        # Define the config
        conf = ConnectionConfig(
            MAIL_USERNAME=settings.EMAIL_USERNAME,
            MAIL_PASSWORD=settings.EMAIL_PASSWORD,
            MAIL_FROM=settings.EMAIL_FROM,
            MAIL_PORT=settings.EMAIL_PORT,
            MAIL_SERVER=settings.EMAIL_HOST,
            MAIL_STARTTLS=settings.USE_TLS,
            MAIL_SSL_TLS=False,
            USE_CREDENTIALS=True,
            VALIDATE_CERTS=True
        )
        # Generate email based on template (specified in sending functions below)
        template = env.get_template(f'{template}.html')

        html = template.render(
            url=self.url,
            first_name=self.name,
            subject=subject
        )

        # Define the message options
        message = MessageSchema(
            subject=subject,
            recipients=self.email,
            body=html,
            subtype="html"
        )

        # Send the email
        fm = FastMail(conf)
        await fm.send_message(message)

    async def sendVerificationCode(self):
        await self.sendMail('CGMStats: Verify your email', 'verification')

    async def sendResetCode(self):
        await self.sendMail('CGMStats: Your password reset link', 'password_reset')
