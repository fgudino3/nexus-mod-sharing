from dataclasses import dataclass
from uuid import UUID

from app.lib.association_base import AssociationBase

from .role import Role

from litestar_users.adapter.sqlalchemy.mixins import SQLAlchemyUserMixin

from litestar.contrib.sqlalchemy.base import UUIDBase
from litestar.contrib.sqlalchemy.dto import SQLAlchemyDTO, SQLAlchemyDTOConfig
from litestar.dto.config import DTOConfig
from litestar.dto import DataclassDTO

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String


class FriendRequests(AssociationBase):
    from_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"), primary_key=True)
    to_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"), primary_key=True)


class Friendship(AssociationBase):
    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"), primary_key=True)
    friend_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"), primary_key=True)


class User(UUIDBase, SQLAlchemyUserMixin):
    nexus_username: Mapped[str] = mapped_column(String(20))
    nexus_profile_url: Mapped[str] = mapped_column(String(128))
    roles: Mapped[list[Role]] = relationship(secondary="user_role", lazy="selectin")
    friends: Mapped[list["User"]] = relationship(
        secondary="friendship",
        lazy="noload",
        primaryjoin="User.id==Friendship.user_id",
        secondaryjoin="User.id==Friendship.friend_id",
    )


@dataclass
class UserRegistrationSchema:
    email: str
    password: str
    nexus_username: str
    nexus_profile_url: str


class UserRegistrationDTO(DataclassDTO[UserRegistrationSchema]):
    config = DTOConfig(rename_strategy="camel")


class UserReadDTO(SQLAlchemyDTO[User]):
    config = SQLAlchemyDTOConfig(
        rename_strategy="camel", exclude={"password_hash", "is_active", "is_verified"}
    )


class UserUpdateDTO(SQLAlchemyDTO[User]):
    # updated in UserService.post_login_hook
    config = SQLAlchemyDTOConfig(partial=True)
