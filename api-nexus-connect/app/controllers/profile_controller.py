from app.lib.providers import provide_profile_repo, provide_mods_repo
from app.lib.types import AuthRequest
from app.models.mod import ModRepository
from app.models.mod_profile import (
    Profile,
    ProfileReadDTO,
    ProfileUpdateDTO,
    ProfileRepository,
)

from litestar import Controller, get, post
from litestar.di import Provide
from litestar.pagination import OffsetPagination
from litestar.repository.filters import LimitOffset


class ModProfileController(Controller):
    dto = ProfileUpdateDTO
    return_dto = ProfileReadDTO
    path = "/profiles"
    dependencies = {
        "profile_repo": Provide(provide_profile_repo),
        "mod_repo": Provide(provide_mods_repo),
    }

    @get()
    async def get_profiles(
        self,
        profile_repo: ProfileRepository,
        limit_offset: LimitOffset,
        request: AuthRequest,
    ) -> OffsetPagination[Profile]:
        results, total = await profile_repo.list_and_count(limit_offset)

        return OffsetPagination[Profile](
            items=results,
            total=total,
            limit=limit_offset.limit,
            offset=limit_offset.offset,
        )

    @post()
    async def create_profile(
        self,
        profile_repo: ProfileRepository,
        mod_repo: ModRepository,
        data: Profile,
        request: AuthRequest,
        mod_ids: list[int],
    ) -> Profile:
        mod_list = []

        for mod_id in mod_ids:
            mod_list.append(await mod_repo.get(mod_id))

        data.mods.extend(mod_list)
        profile = await profile_repo.add(data)

        return profile
