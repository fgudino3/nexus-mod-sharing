from app.lib.providers import provide_mods_repo
from app.lib.types import AuthRequest
from app.models.mod import (
    Mod,
    ModRepository,
    ModUpdateDTO,
    ModReadDTO,
)

from litestar import Controller, get, post
from litestar.di import Provide
from litestar.pagination import OffsetPagination
from litestar.repository.filters import LimitOffset


class ModController(Controller):
    dto = ModUpdateDTO
    return_dto = ModReadDTO
    path = "/mods"
    dependencies = {"mods_repo": Provide(provide_mods_repo)}

    @get()
    async def get_mods(
        self,
        mods_repo: ModRepository,
        limit_offset: LimitOffset,
        request: AuthRequest,
    ) -> OffsetPagination[Mod]:
        print(request.auth, request.user.email)
        results, total = await mods_repo.list_and_count(limit_offset)

        return OffsetPagination[Mod](
            items=results,
            total=total,
            limit=limit_offset.limit,
            offset=limit_offset.offset,
        )

    @post()
    async def create_mod(
        self, mods_repo: ModRepository, data: Mod, request: AuthRequest
    ) -> Mod:
        mod = await mods_repo.add(data)

        return mod
