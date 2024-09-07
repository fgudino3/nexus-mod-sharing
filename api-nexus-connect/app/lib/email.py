from email.message import EmailMessage

from app.settings import AppConfig

from aiosmtplib import send


async def send_email(to_email: str, subject: str, content: str) -> None:
    """Send an email from support email"""
    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = AppConfig.GMAIL_EMAIL
    message["To"] = AppConfig.GMAIL_EMAIL  # TODO: replace with to_email
    message.set_content(content)

    await send(
        message,
        hostname="smtp.gmail.com",
        port=465,
        use_tls=True,
        username=AppConfig.GMAIL_EMAIL,
        password=AppConfig.GMAIL_APP_PASSWORD,
    )
