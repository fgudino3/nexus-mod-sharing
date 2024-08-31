from typing import Annotated

from litestar.contrib.sqlalchemy.base import UUIDBase
from litestar.contrib.sqlalchemy.dto import SQLAlchemyDTO
from litestar.contrib.sqlalchemy.repository import SQLAlchemyAsyncRepository
from litestar.dto.config import DTOConfig
from sqlalchemy.orm import Mapped


class Account(UUIDBase):
    name: Mapped[str]
    email: Mapped[str]
    nexus_username: Mapped[str]


class AccountRepository(SQLAlchemyAsyncRepository[Account]):
    model_type = Account


write_config = DTOConfig(exclude={"created_at", "updated_at", "nationality"})
AccountWriteDTO = SQLAlchemyDTO[Annotated[Account, write_config]]
AccountReadDTO = SQLAlchemyDTO[Account]
