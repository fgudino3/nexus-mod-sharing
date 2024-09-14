from typing import Optional
from uuid import UUID
from dataclasses import dataclass

from app.lib.association_base import AssociationBase
from app.models.manual_mod import ManualModProfile
from app.models.user import User
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
    game: Mapped[str] = mapped_column(String(128))
    description: Mapped[str] = mapped_column(String(512))
    mod_count: Mapped[int] = mapped_column()
    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"))
    user: Mapped[User] = relationship(lazy="joined")
    mods: Mapped[list[ModProfile]] = relationship(
        lazy="selectin", order_by="ModProfile.order"
    )
    manual_mods: Mapped[list[ManualModProfile]] = relationship(
        lazy="selectin", order_by="ManualModProfile.order"
    )


class ProfileRepository(SQLAlchemyAsyncRepository[Profile]):
    model_type = Profile


class ProfileReadDTO(SQLAlchemyDTO[Profile]):
    config = SQLAlchemyDTOConfig(
        exclude={
            "created_at",
            "updated_at",
            "user.password_hash",
            "user.email",
            "user.is_active",
            "user.is_verified",
        },
        rename_strategy="camel",
    )


class ProfileUpdateDTO(SQLAlchemyDTO[Profile]):
    config = SQLAlchemyDTOConfig(
        partial=True,
        rename_strategy="camel",
        exclude={"created_at", "updated_at", "user_id"},
    )


@dataclass
class NcMod:
    id: Optional[int]
    name: str
    description: Optional[str]
    author: Optional[str]
    page_url: Optional[str]
    image_url: Optional[str]
    version: Optional[str]
    order: str
    intalled: bool
    is_patched: bool


@dataclass
class ProfileUser:
    nexus_username: str
    nexus_profile_url: str


@dataclass
class ProfilePage:
    id: UUID
    name: str
    game: str
    description: str
    user_id: UUID
    user: ProfileUser
    mods: list[NcMod]


class ProfilePageReadDTO(DataclassDTO[ProfilePage]):
    config = DTOConfig(rename_strategy="camel")


def profile_to_profile_page(profile: Profile) -> ProfilePage:
    mods = list(
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
    )

    mods.extend(
        list(
            map(
                lambda mod: NcMod(
                    id=None,
                    name=mod.mod.name,
                    description=mod.mod.description,
                    author=mod.mod.author,
                    image_url=None,
                    intalled=True,
                    is_patched=False,
                    order=mod.order,
                    page_url=mod.mod.page_url,
                    version=None,
                ),
                profile.manual_mods,
            )
        )
    )

    mods.sort(key=lambda mod: mod.order)

    return ProfilePage(
        id=profile.id,
        name=profile.name,
        game=profile.game,
        description=profile.description,
        user_id=profile.user_id,
        user=ProfileUser(profile.user.nexus_username, profile.user.nexus_profile_url),
        mods=mods,
    )
