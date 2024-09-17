from uuid import UUID

from app.lib.types import AuthRequest
from app.models.user import User, UserReadDTO, UserUpdateDTO
from app.services.user_service import UserService

from litestar import Controller, post
from litestar.di import Provide

from litestar_users.dependencies import provide_user_service


class UserController(Controller):
    dto = UserUpdateDTO
    return_dto = UserReadDTO
    path = "/users"
    dependencies = {
        "user_service": Provide(provide_user_service, sync_to_thread=False),
    }

    @post("/follow/{user_id:uuid}")
    async def follow_user(
        self,
        user_service: UserService,
        user_id: UUID,
        request: AuthRequest,
    ) -> User:
        user = await user_service.follow(request.user, user_id)

        return user
