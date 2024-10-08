from dataclasses import dataclass
from uuid import UUID

from app.lib.association_base import AssociationBase

from .role import Role

from litestar_users.adapter.sqlalchemy.mixins import SQLAlchemyUserMixin

from litestar.contrib.sqlalchemy.base import UUIDAuditBase
from litestar.contrib.sqlalchemy.dto import SQLAlchemyDTO, SQLAlchemyDTOConfig
from litestar.dto.config import DTOConfig
from litestar.dto import DataclassDTO

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String


class Following(AssociationBase):
    follower_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"), primary_key=True)
    followed_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"), primary_key=True)


class User(UUIDAuditBase, SQLAlchemyUserMixin):
    nexus_username: Mapped[str] = mapped_column(String(128), unique=True)
    nexus_profile_url: Mapped[str] = mapped_column(String(128))
    roles: Mapped[list[Role]] = relationship(secondary="user_role", lazy="selectin")
    following: Mapped[list["User"]] = relationship(
        secondary="following",
        lazy="noload",
        primaryjoin="User.id==Following.follower_id",
        secondaryjoin="User.id==Following.followed_id",
        back_populates="followers",
    )
    followers: Mapped[list["User"]] = relationship(
        secondary="following",
        lazy="noload",
        primaryjoin="User.id==Following.followed_id",
        secondaryjoin="User.id==Following.follower_id",
        back_populates="following",
    )


@dataclass
class UserRegistrationSchema:
    email: str
    password: str
    nexus_username: str
    nexus_profile_url: str


@dataclass
class UserLoginSchema:
    nexus_username: str
    password: str


class UserRegistrationDTO(DataclassDTO[UserRegistrationSchema]):
    config = DTOConfig(rename_strategy="camel")


class UserReadDTO(SQLAlchemyDTO[User]):
    config = SQLAlchemyDTOConfig(
        rename_strategy="camel",
        exclude={
            "password_hash",
            "is_active",
            "is_verified",
            "following.0.password_hash",
            "following.0.email",
            "following.0.is_active",
            "following.0.is_verified",
            "followers.0.password_hash",
            "followers.0.email",
            "followers.0.is_active",
            "followers.0.is_verified",
        },
    )


class UserUpdateDTO(SQLAlchemyDTO[User]):
    # updated in UserService.post_login_hook
    config = SQLAlchemyDTOConfig(partial=True)
