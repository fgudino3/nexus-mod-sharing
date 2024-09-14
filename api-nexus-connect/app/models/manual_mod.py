from typing import Optional
from uuid import UUID

from app.lib.association_base import AssociationBase

from litestar.contrib.sqlalchemy.base import AuditColumns
from litestar.contrib.sqlalchemy.dto import SQLAlchemyDTO, SQLAlchemyDTOConfig
from litestar.contrib.sqlalchemy.repository import SQLAlchemyAsyncRepository
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, ForeignKeyConstraint


class ManualMod(AssociationBase, AuditColumns):
    name: Mapped[str] = mapped_column(String(128), primary_key=True)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"), primary_key=True)
    author: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    page_url: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)


class ManualModProfile(AssociationBase):
    profile_id: Mapped[UUID] = mapped_column(ForeignKey("profile.id"), primary_key=True)
    mod_name: Mapped[str] = mapped_column(String(128))
    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"))
    order: Mapped[str] = mapped_column(String(4))
    version: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)

    __table_args__ = (
        ForeignKeyConstraint([mod_name, user_id], [ManualMod.name, ManualMod.user_id]),
    )
    mod: Mapped[ManualMod] = relationship(lazy="joined")


class ManualModRepository(SQLAlchemyAsyncRepository[ManualMod]):  # type: ignore
    model_type = ManualMod


class ManualModReadDTO(SQLAlchemyDTO[ManualMod]):
    config = SQLAlchemyDTOConfig(
        exclude={"created_at", "updated_at"}, rename_strategy="camel"
    )


class ManualModUpdateDTO(SQLAlchemyDTO[ManualMod]):
    config = SQLAlchemyDTOConfig(
        partial=True,
        rename_strategy="camel",
        exclude={"created_at", "updated_at", "user_id"},
    )
