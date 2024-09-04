from app.models.mod import ModRepository

from litestar.params import Parameter
from litestar.repository.filters import LimitOffset
from sqlalchemy.ext.asyncio import AsyncSession


async def provide_mods_repo(db_session: AsyncSession) -> ModRepository:
    return ModRepository(session=db_session, auto_commit=True)


async def provide_limit_offset_pagination(
    current_page: int = Parameter(ge=1, query="currentPage", default=1, required=False),
    page_size: int = Parameter(
        query="pageSize",
        ge=1,
        default=10,
        required=False,
    ),
) -> LimitOffset:
    """Add offset/limit pagination.

    Return type consumed by `Repository.apply_limit_offset_pagination()`.

    Parameters
    ----------
    current_page : int
        LIMIT to apply to select.
    page_size : int
        OFFSET to apply to select.
    """
    return LimitOffset(page_size, page_size * (current_page - 1))
