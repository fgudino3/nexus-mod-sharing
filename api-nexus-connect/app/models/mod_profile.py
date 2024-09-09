from uuid import UUID

from app.lib.association_base import AssociationBase
from .mod import Mod

from litestar.contrib.sqlalchemy.base import UUIDAuditBase
from litestar.contrib.sqlalchemy.dto import SQLAlchemyDTO, SQLAlchemyDTOConfig
from litestar.contrib.sqlalchemy.repository import SQLAlchemyAsyncRepository
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey


class ModProfile(AssociationBase):
    profile_id: Mapped[UUID] = mapped_column(ForeignKey("profile.id"), primary_key=True)
    mod_id: Mapped[int] = mapped_column(ForeignKey("mod.id"), primary_key=True)
    # version: Mapped[str] = mapped_column(String(20))


class Profile(UUIDAuditBase):
    name: Mapped[str] = mapped_column(String(128))
    description: Mapped[str] = mapped_column(String(512))
    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"))
    mods: Mapped[list[Mod]] = relationship(
        Mod,
        secondary="mod_profile",
        lazy="selectin",
    )


class ProfileRepository(SQLAlchemyAsyncRepository[Profile]):
    model_type = Profile


class ProfileReadDTO(SQLAlchemyDTO[Profile]):
    config = SQLAlchemyDTOConfig(
        exclude={"created_at", "updated_at"}, rename_strategy="camel"
    )


class ProfileUpdateDTO(SQLAlchemyDTO[Profile]):
    config = SQLAlchemyDTOConfig(
        partial=True, rename_strategy="camel", exclude={"created_at", "updated_at"}
    )
