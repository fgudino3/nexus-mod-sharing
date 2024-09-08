from uuid import UUID

from app.lib.association_base import AssociationBase

from litestar.contrib.sqlalchemy.base import UUIDBase
from litestar.contrib.sqlalchemy.dto import SQLAlchemyDTO, SQLAlchemyDTOConfig
from litestar_users.adapter.sqlalchemy.mixins import SQLAlchemyRoleMixin

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey


class UserRole(AssociationBase):
    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"), primary_key=True)
    role_id: Mapped[UUID] = mapped_column(ForeignKey("role.id"), primary_key=True)


class Role(UUIDBase, SQLAlchemyRoleMixin):
    pass


class RoleCreateDTO(SQLAlchemyDTO[Role]):
    config = SQLAlchemyDTOConfig(exclude={"id"})


class RoleReadDTO(SQLAlchemyDTO[Role]):
    pass


class RoleUpdateDTO(SQLAlchemyDTO[Role]):
    config = SQLAlchemyDTOConfig(exclude={"id"}, partial=True)
