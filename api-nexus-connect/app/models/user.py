from dataclasses import dataclass

from .role import Role

from litestar.contrib.sqlalchemy.base import UUIDBase
from litestar.contrib.sqlalchemy.dto import SQLAlchemyDTO, SQLAlchemyDTOConfig
from litestar_users.adapter.sqlalchemy.mixins import SQLAlchemyUserMixin
from litestar.dto import DataclassDTO
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String


class User(UUIDBase, SQLAlchemyUserMixin):
    name: Mapped[str] = mapped_column(String(20))
    nexus_username: Mapped[str] = mapped_column(String(20))

    roles: Mapped[list[Role]] = relationship(
        Role, secondary="user_role", lazy="selectin"
    )


@dataclass
class UserRegistrationSchema:
    email: str
    password: str
    name: str
    nexus_username: str


class UserRegistrationDTO(DataclassDTO[UserRegistrationSchema]):
    """User registration DTO."""


class UserReadDTO(SQLAlchemyDTO[User]):
    config = SQLAlchemyDTOConfig(rename_strategy="camel", exclude={"password_hash"})


class UserUpdateDTO(SQLAlchemyDTO[User]):
    # updated in UserService.post_login_hook
    config = SQLAlchemyDTOConfig(partial=True)
