from app.lib.providers import provide_accounts_repo
from app.models.account import (
    Account,
    AccountRepository,
    AccountWriteDTO,
    AccountReadDTO,
)

from litestar import Controller, get, post
from litestar.di import Provide
from litestar.pagination import OffsetPagination
from litestar.repository.filters import LimitOffset


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
    ) -> OffsetPagination[Account]:
        print("ping")
        results, total = await accounts_repo.list_and_count(limit_offset)
        # type_adapter = TypeAdapter(list[Account])

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
