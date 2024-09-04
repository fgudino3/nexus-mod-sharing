from typing import Any

from app.models.user import User

from litestar import Request
from litestar.security.jwt import Token


class AuthRequest(Request[User, Token, Any]):
    """Request[User, Token, Any] wrapper that contains auth data"""
