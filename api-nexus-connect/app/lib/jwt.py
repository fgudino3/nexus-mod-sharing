from typing import Any, Optional
from app.models.account import Account

from litestar.connection import ASGIConnection
from litestar.security.jwt import JWTAuth, Token


# JWTAuth requires a retrieve handler callable that receives the JWT token model and the ASGI connection
# and returns the 'User' instance correlating to it.
#
# Notes:
# - 'User' can be any arbitrary value you decide upon.
# - The callable can be either sync or async - both will work.
async def retrieve_user_handler(
    token: Token, connection: "ASGIConnection[Any, Any, Any, Any]"
) -> Optional[Account]:
    # logic here to retrieve the user instance
    return Account(
        id=token.sub,
        email=token.extras["email"],
        nexus_username=token.extras["nexus_username"],
    )


jwt_auth = JWTAuth[Account](
    retrieve_user_handler=retrieve_user_handler,
    token_secret="abc123",  # environ.get("JWT_SECRET", "abcd123"),
    # we are specifying which endpoints should be excluded from authentication. In this case the login endpoint
    # and our openAPI docs.
    exclude=["/accounts/login", "/schema"],
)
