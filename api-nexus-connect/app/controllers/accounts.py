from typing import Any
from app.lib.providers import provide_accounts_repo
from app.lib.jwt import jwt_auth
from app.models.account import (
    Account,
    AccountRepository,
    AccountWriteDTO,
    AccountReadDTO,
)

from litestar import Controller, get, post, Request, Response
from litestar.di import Provide
from litestar.pagination import OffsetPagination
from litestar.repository.filters import LimitOffset
from litestar.security.jwt import Token


class AccountController(Controller):
    dto = AccountWriteDTO
    return_dto = AccountReadDTO
    path = "/accounts"
    dependencies = {"accounts_repo": Provide(provide_accounts_repo)}

    @get()
    async def get_accounts(
        self,
        accounts_repo: AccountRepository,
        limit_offset: LimitOffset,
        request: Request[Account, Token, Any],
    ) -> OffsetPagination[Account]:
        print(request.auth, request.user.email)
        results, total = await accounts_repo.list_and_count(limit_offset)

        return OffsetPagination[Account](
            items=results,
            total=total,
            limit=limit_offset.limit,
            offset=limit_offset.offset,
        )

    @post()
    async def create_account(
        self, accounts_repo: AccountRepository, data: Account
    ) -> Account:
        created_account = await accounts_repo.add(data)

        await accounts_repo.session.commit()

        return created_account

    @post("/login")
    async def login_handler(
        self,
        accounts_repo: AccountRepository,
        id: str,
    ) -> Response[Account]:
        account = await accounts_repo.get(id)

        return jwt_auth.login(
            identifier=str(account.id),
            token_extras={
                "email": account.email,
                "nexus_username": account.nexus_username,
            },
            response_body=account,
        )
