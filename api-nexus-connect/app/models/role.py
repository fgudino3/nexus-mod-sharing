from uuid import UUID

from litestar.contrib.sqlalchemy.base import UUIDBase
from litestar.contrib.sqlalchemy.dto import SQLAlchemyDTO, SQLAlchemyDTOConfig
from litestar_users.adapter.sqlalchemy.mixins import SQLAlchemyRoleMixin
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Uuid, ForeignKey


class Role(UUIDBase, SQLAlchemyRoleMixin):
    pass


class UserRole(UUIDBase):
    user_id: Mapped[UUID] = mapped_column(Uuid(), ForeignKey("user.id"))
    role_id: Mapped[UUID] = mapped_column(Uuid(), ForeignKey("role.id"))


class RoleCreateDTO(SQLAlchemyDTO[Role]):
    config = SQLAlchemyDTOConfig(exclude={"id"})


class RoleReadDTO(SQLAlchemyDTO[Role]):
    pass


class RoleUpdateDTO(SQLAlchemyDTO[Role]):
    config = SQLAlchemyDTOConfig(exclude={"id"}, partial=True)
