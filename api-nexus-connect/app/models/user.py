from dataclasses import dataclass
from typing import Any

from litestar.contrib.sqlalchemy.base import UUIDBase
from litestar.contrib.sqlalchemy.dto import SQLAlchemyDTO, SQLAlchemyDTOConfig
from litestar.contrib.sqlalchemy.repository import SQLAlchemyAsyncRepository
from litestar_users.adapter.sqlalchemy.mixins import SQLAlchemyUserMixin
from litestar_users.service import BaseUserService
from litestar.dto import DataclassDTO
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String


class User(UUIDBase, SQLAlchemyUserMixin):
    name: Mapped[str] = mapped_column(String(20))
    nexus_username: Mapped[str] = mapped_column(String(20))


@dataclass
class UserRegistrationSchema:
    email: str
    password: str
    name: str
    nexus_username: str


class UserRegistrationDTO(DataclassDTO[UserRegistrationSchema]):
    """User registration DTO."""


class UserRepository(SQLAlchemyAsyncRepository[User]):
    model_type = User


class UserReadDTO(SQLAlchemyDTO[User]):
    config = SQLAlchemyDTOConfig()


class UserUpdateDTO(SQLAlchemyDTO[User]):
    # updated in UserService.post_login_hook
    config = SQLAlchemyDTOConfig(partial=True)


class UserService(BaseUserService[User, Any]):  # type: ignore[type-var]
    async def send_verification_token(self, user: User, token: str) -> None:
        """Send token via email"""
        print(user.email, token)

    async def send_password_reset_token(self, user: User, token: str) -> None:
        """Send token via email"""
        print(user.email, token)
