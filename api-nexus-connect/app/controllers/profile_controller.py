from uuid import UUID

from app.lib.providers import provide_profile_repo, provide_profile_only_repo
from app.lib.types import AuthRequest
from app.models.mod_profile import (
    Profile,
    ProfilePage,
    ProfileReadDTO,
    ProfileUpdateDTO,
    ProfileRepository,
    ProfilePageReadDTO,
    profile_to_profile_page,
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
    }

    @get(dependencies={"profile_repo": Provide(provide_profile_only_repo)})
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

    @get("/{profile_id:uuid}", return_dto=ProfilePageReadDTO)
    async def get_profile_and_mods(
        self,
        profile_repo: ProfileRepository,
        profile_id: UUID,
        request: AuthRequest,
    ) -> ProfilePage:
        profile = await profile_repo.get(profile_id)

        profile_page = profile_to_profile_page(profile)

        return profile_page

    @post()
    async def create_profile(
        self,
        profile_repo: ProfileRepository,
        data: Profile,
        request: AuthRequest,
    ) -> Profile:
        profile = await profile_repo.add(data)

        return profile
