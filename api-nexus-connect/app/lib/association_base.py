from sqlalchemy.orm import DeclarativeBase

from litestar.contrib.sqlalchemy.base import (
    CommonTableAttributes,
    orm_registry,
)


class AssociationBase(DeclarativeBase, CommonTableAttributes):
    registry = orm_registry
