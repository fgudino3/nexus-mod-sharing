from typing import Any
from uuid import UUID

from app.models.user import User
from app.models.role import Role

from litestar import Request
from litestar.exceptions.http_exceptions import ClientException

from litestar_users.service import BaseUserService

from sqlalchemy.orm import immediateload
from advanced_alchemy.exceptions import NotFoundError


class UserService(BaseUserService[User, Role]):  # type: ignore[type-var]
    followLoaders = [immediateload(User.following), immediateload(User.followers)]

    async def follow(self, user: User, user_to_follow_id: UUID) -> User:
        user_id = user.id

        self.user_repository.session.expunge(user)

        user = await self.user_repository.get(
            user_id,
            load=self.followLoaders,
        )

        try:
            user_to_follow = await self.user_repository.get(user_to_follow_id)
        except NotFoundError:
            raise ClientException("This user does not exist")

        if user_to_follow in user.following:
            raise ClientException("You are already following this user")

        user.following.append(user_to_follow)

        await self.user_repository.session.commit()

        return user

    async def unfollow(self, user: User, user_to_unfollow_id: UUID) -> User:
        user_id = user.id

        self.user_repository.session.expunge(user)

        user = await self.user_repository.get(
            user_id,
            load=self.followLoaders,
        )

        try:
            user_to_unfollow = await self.user_repository.get(user_to_unfollow_id)
        except NotFoundError:
            raise ClientException("This user does not exist")

        if user_to_unfollow not in user.following:
            raise ClientException("You are already are not following this user")

        user.following.remove(user_to_unfollow)

        await self.user_repository.session.commit()

        return user

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
            load=self.followLoaders,
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
