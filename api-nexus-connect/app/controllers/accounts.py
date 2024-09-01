from typing import Any
from app.lib.providers import provide_accounts_repo
from app.models.user import (
    User,
    UserRepository,
    UserUpdateDTO,
    UserReadDTO,
)

from litestar import Controller, get, Request
from litestar.di import Provide
from litestar.pagination import OffsetPagination
from litestar.repository.filters import LimitOffset
from litestar.security.jwt import Token


class AccountController(Controller):
    dto = UserUpdateDTO
    return_dto = UserReadDTO
    path = "/accounts"
    dependencies = {"accounts_repo": Provide(provide_accounts_repo)}

    @get()
    async def get_accounts(
        self,
        accounts_repo: UserRepository,
        limit_offset: LimitOffset,
        request: Request[User, Token, Any],
    ) -> OffsetPagination[User]:
        print(request.auth, request.user.email)
        results, total = await accounts_repo.list_and_count(limit_offset)

        return OffsetPagination[User](
            items=results,
            total=total,
            limit=limit_offset.limit,
            offset=limit_offset.offset,
        )
