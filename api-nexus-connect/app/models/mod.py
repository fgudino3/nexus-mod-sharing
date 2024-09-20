from typing import Optional
from litestar.contrib.sqlalchemy.base import BigIntAuditBase
from litestar.contrib.sqlalchemy.dto import SQLAlchemyDTO, SQLAlchemyDTOConfig
from litestar.contrib.sqlalchemy.repository import SQLAlchemyAsyncRepository
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Boolean, String


class Mod(BigIntAuditBase):
    name: Mapped[str] = mapped_column(String(128))
    description: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    author: Mapped[str] = mapped_column(String(128))
    page_url: Mapped[str] = mapped_column(String(128))
    available: Mapped[bool] = mapped_column(Boolean())


class ModRepository(SQLAlchemyAsyncRepository[Mod]):
    model_type = Mod


class ModReadDTO(SQLAlchemyDTO[Mod]):
    config = SQLAlchemyDTOConfig(
        exclude={"created_at", "updated_at"}, rename_strategy="camel"
    )


class ModUpdateDTO(SQLAlchemyDTO[Mod]):
    config = SQLAlchemyDTOConfig(
        partial=True, rename_strategy="camel", exclude={"created_at", "updated_at"}
    )
