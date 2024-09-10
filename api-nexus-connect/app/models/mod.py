from litestar.contrib.sqlalchemy.base import BigIntAuditBase
from litestar.contrib.sqlalchemy.dto import SQLAlchemyDTO, SQLAlchemyDTOConfig
from litestar.contrib.sqlalchemy.repository import SQLAlchemyAsyncRepository
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String


class Mod(BigIntAuditBase):
    name: Mapped[str] = mapped_column(String(128))
    description: Mapped[str] = mapped_column(String(512))
    author: Mapped[str] = mapped_column(String(128))
    page_url: Mapped[str] = mapped_column(String(128))
    image_url: Mapped[str] = mapped_column(String(128))


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
