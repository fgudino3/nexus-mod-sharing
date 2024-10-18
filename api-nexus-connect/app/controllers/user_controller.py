from uuid import UUID

from app.lib.types import AuthRequest
from app.models.user import User, UserReadDTO, UserUpdateDTO
from app.services.user_service import UserService

from litestar import Controller, get, post
from litestar.di import Provide

from litestar_users.dependencies import provide_user_service
from litestar_users.schema import (
    ForgotPasswordSchema,
)


class UserController(Controller):
    dto = UserUpdateDTO
    return_dto = UserReadDTO
    path = "/users"
    dependencies = {
        "user_service": Provide(provide_user_service, sync_to_thread=False),
    }

    @get("/following")
    async def get_following(
        self,
        user_service: UserService,
        request: AuthRequest,
    ) -> list[User]:
        users = await user_service.get_following(request.user.id)

        return users

    @get("/followers")
    async def get_followers(
        self,
        user_service: UserService,
        request: AuthRequest,
    ) -> list[User]:
        users = await user_service.get_followers(request.user.id)

        return users

    @post("/follow/{user_id:uuid}")
    async def follow_user(
        self,
        user_service: UserService,
        user_id: UUID,
        request: AuthRequest,
    ) -> User:
        user = await user_service.follow(request.user, user_id)

        return user

    @post("/unfollow/{user_id:uuid}")
    async def unfollow_user(
        self,
        user_service: UserService,
        user_id: UUID,
        request: AuthRequest,
    ) -> User:
        user = await user_service.unfollow(request.user, user_id)

        return user

    @post("/forgot-password", dto=None)
    async def forgot_password(
        self,
        data: ForgotPasswordSchema,
        user_service: UserService,
        request: AuthRequest,
    ) -> None:
        await user_service.initiate_password_reset(data.email, request)
