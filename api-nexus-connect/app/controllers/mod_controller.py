from app.lib.providers import provide_manual_mod_repo, provide_mod_repo
from app.lib.types import AuthRequest
from app.models.manual_mod import (
    ManualMod,
    ManualModReadDTO,
    ManualModRepository,
    ManualModUpdateDTO,
)
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
from advanced_alchemy.exceptions import NotFoundError


class ModController(Controller):
    dto = ModUpdateDTO
    return_dto = ModReadDTO
    path = "/mods"
    dependencies = {
        "mod_repo": Provide(provide_mod_repo),
        "manual_mod_repo": Provide(provide_manual_mod_repo),
    }

    @get()
    async def get_mods(
        self,
        mod_repo: ModRepository,
        limit_offset: LimitOffset,
        request: AuthRequest,
    ) -> OffsetPagination[Mod]:
        print(request.auth, request.user.email)
        results, total = await mod_repo.list_and_count(limit_offset)

        return OffsetPagination[Mod](
            items=results,
            total=total,
            limit=limit_offset.limit,
            offset=limit_offset.offset,
        )

    @post()
    async def get_or_create_mod(
        self, mod_repo: ModRepository, data: Mod, request: AuthRequest
    ) -> Mod:
        try:
            mod = await mod_repo.get(data.id)

            return mod
        except NotFoundError:
            mod = await mod_repo.add(data)
            return mod

    @post("/manual", dto=ManualModUpdateDTO, return_dto=ManualModReadDTO)
    async def get_or_create_manual_mod(
        self,
        manual_mod_repo: ManualModRepository,
        data: ManualMod,
        request: AuthRequest,
    ) -> ManualMod:
        try:
            mod = await manual_mod_repo.get_one(name=data.name, user_id=request.user.id)

            return mod
        except NotFoundError:
            data.user_id = request.user.id
            mod = await manual_mod_repo.add(data)
            return mod
