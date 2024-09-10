from uuid import UUID
from dataclasses import dataclass

from app.lib.association_base import AssociationBase
from .mod import Mod

from litestar.dto import DataclassDTO
from litestar.dto.config import DTOConfig
from litestar.contrib.sqlalchemy.base import UUIDAuditBase
from litestar.contrib.sqlalchemy.dto import SQLAlchemyDTO, SQLAlchemyDTOConfig
from litestar.contrib.sqlalchemy.repository import SQLAlchemyAsyncRepository

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, ForeignKey


class ModProfile(AssociationBase):
    profile_id: Mapped[UUID] = mapped_column(ForeignKey("profile.id"), primary_key=True)
    mod_id: Mapped[int] = mapped_column(ForeignKey("mod.id"), primary_key=True)
    version: Mapped[str] = mapped_column(String(20))
    order: Mapped[str] = mapped_column(String(4))
    installed: Mapped[bool] = mapped_column(Boolean())
    is_patched: Mapped[bool] = mapped_column(Boolean())
    mod: Mapped[Mod] = relationship(lazy="joined")


class Profile(UUIDAuditBase):
    name: Mapped[str] = mapped_column(String(128))
    description: Mapped[str] = mapped_column(String(512))
    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"))
    mods: Mapped[list[ModProfile]] = relationship(
        lazy="selectin", order_by="ModProfile.order"
    )


class ProfileRepository(SQLAlchemyAsyncRepository[Profile]):
    model_type = Profile


class ProfileReadDTO(SQLAlchemyDTO[Profile]):
    config = SQLAlchemyDTOConfig(
        exclude={"created_at", "updated_at"}, rename_strategy="camel"
    )


class ProfileUpdateDTO(SQLAlchemyDTO[Profile]):
    config = SQLAlchemyDTOConfig(
        partial=True,
        rename_strategy="camel",
        exclude={"created_at", "updated_at"},
    )


@dataclass
class NcMod:
    id: int
    name: str
    description: str
    author: str
    page_url: str
    image_url: str
    version: str
    order: str
    intalled: bool
    is_patched: bool


@dataclass
class ProfilePage:
    id: UUID
    name: str
    description: str
    user_id: UUID
    mods: list[NcMod]


class ProfilePageReadDTO(DataclassDTO[ProfilePage]):
    config = DTOConfig(rename_strategy="camel")


def profile_to_profile_page(profile: Profile) -> ProfilePage:
    return ProfilePage(
        id=profile.id,
        name=profile.name,
        description=profile.description,
        user_id=profile.user_id,
        mods=list(
            map(
                lambda mod: NcMod(
                    id=mod.mod_id,
                    name=mod.mod.name,
                    description=mod.mod.description,
                    author=mod.mod.author,
                    image_url=mod.mod.image_url,
                    intalled=mod.installed,
                    is_patched=mod.is_patched,
                    order=mod.order,
                    page_url=mod.mod.page_url,
                    version=mod.version,
                ),
                profile.mods,
            )
        ),
    )
