"""
Contains email class and non-config environmental settings.
Email class methods also handles all email-sending tasks.
"""

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from jinja2 import Environment, select_autoescape, FileSystemLoader
from pydantic import EmailStr
from config import settings
from database import User as dbUser
from random import randbytes
from hashlib import sha256
from fastapi import Request, HTTPException

""" Specify variables for using html templates. """
env = Environment(
    loader=FileSystemLoader(searchpath="./templates"),
    autoescape=select_autoescape(['html', 'xml'])
)


class Email:
    """
    Email object, creates custom emails to users using HTML templates.
    Note: email not sent until
    """

    def __init__(self, db_user: dbUser, topic: str, request: Request):
        token = randbytes(10)
        hashed_code = sha256()
        hashed_code.update(token)
        verification_code = hashed_code.hexdigest()

        db_user.verification_code = verification_code

        self.name = db_user.name
        self.email = [EmailStr(db_user.email)]
        self.request = request
        self.topic = topic
        self.url = f"{self.request.url.scheme}://{settings.HOST_DOMAIN}/{topic.replace('_', '')}/{token.hex()}"

    async def send(self):
        """
        Configures and sends email with information in object.
        """

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
        template = env.get_template(f'{self.topic}.html')
        print(self.topic)

        if self.topic == "verify_email":
            subject = 'CGMStats: Verify your email'
        elif self.topic == "reset_password":
            subject = 'CGMStats: Your password reset link'
        else:
            raise HTTPException(status_code=500, detail="Invalid topic for email.")

        # Render email using given template with specified url, name, and subject
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
        mailer = FastMail(conf)
        await mailer.send_message(message)
