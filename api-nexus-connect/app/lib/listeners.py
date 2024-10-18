from .email import send_email

from litestar.events import listener


@listener("register_verify")
async def send_verify_token_email_handler(email: str, token: str) -> None:
    await send_email(
        to_email=email, subject="Verify your account with Nexus Connect", content=token
    )


@listener("password_reset")
async def send_password_reset_token_email_handler(email: str, token: str) -> None:
    await send_email(
        to_email=email,
        subject="Use this token to set a new password in Nexus Connect",
        content=token,
    )


event_listeners = [
    send_verify_token_email_handler,
    send_password_reset_token_email_handler,
]
