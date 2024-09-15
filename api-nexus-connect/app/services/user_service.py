from typing import Any

from app.models.user import User
from app.models.role import Role

from litestar import Request

from litestar_users.service import BaseUserService

from sqlalchemy.orm import immediateload
from sqlalchemy import select


class UserService(BaseUserService[User, Role]):  # type: ignore[type-var]
    async def authenticate(
        self, data: Any, request: Request | None = None
    ) -> User | None:
        preFriendsUser = await super().authenticate(data, request)

        if not preFriendsUser:
            return None

        user_id = preFriendsUser.id

        self.user_repository.session.expunge(preFriendsUser)

        user = await self.user_repository.get(
            user_id,
            statement=select(User).options(immediateload(User.friends)),
        )

        return user

    async def register(
        self, data: dict[str, Any], request: Request | None = None
    ) -> User:
        """Register a new user and optionally run custom business logic.

        Args:
            data: User creation data transfer object.
            request: The litestar request that initiated the action.
        """
        await self.pre_registration_hook(data, request)

        data["password_hash"] = self.password_manager.hash(data.pop("password"))

        verify = not self.require_verification_on_registration
        user = await self.add_user(self.user_model(**data), verify=verify)  # type: ignore[arg-type]

        if self.require_verification_on_registration:
            await self.initiate_verification(user, request)

        await self.post_registration_hook(user, request)

        return user

    async def initiate_verification(
        self, user: User, request: Request | None = None
    ) -> None:
        """Initiate the user verification flow.

        Args:
            user: The user requesting verification.

        Notes:
            - The user verification flow is not initiated when `require_verification_on_registration` is set to `False`.
        """
        token = self.generate_token(user.id, aud="verify")
        await self.send_verification_token(user, token, request)

    async def send_verification_token(
        self, user: User, token: str, request: Request | None = None
    ) -> None:
        if request:
            request.app.emit("register_verify", email=user.email, token=token)

    async def send_password_reset_token(self, user: User, token: str) -> None:
        """Send token via email"""
        print(user.email, token)
