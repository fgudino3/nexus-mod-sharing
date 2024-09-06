from .email import send_email

from litestar.events import listener


@listener("register_verify")
async def send_verify_token_email_handler(email: str, token: str) -> None:
    await send_email(
        to_email=email, subject="Verify your account with Nexus Connect", content=token
    )
