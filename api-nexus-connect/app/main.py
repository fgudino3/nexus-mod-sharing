from .controllers.accounts import AccountController
from .lib.providers import provide_limit_offset_pagination
from .lib.jwt import jwt_auth

from litestar.contrib.sqlalchemy.plugins import (
    AsyncSessionConfig,
    SQLAlchemyInitPlugin,
    SQLAlchemyAsyncConfig,
)
from litestar.contrib.sqlalchemy.base import UUIDBase
from litestar.di import Provide
from litestar import Litestar

session_config = AsyncSessionConfig(expire_on_commit=False)
sqlalchemy_config = SQLAlchemyAsyncConfig(
    connection_string="sqlite+aiosqlite:///test.sqlite",
    session_config=session_config,
)  # Create 'db_session' dependency.
sqlalchemy_plugin = SQLAlchemyInitPlugin(config=sqlalchemy_config)


async def on_startup() -> None:
    """Initializes the database."""
    async with sqlalchemy_config.get_engine().begin() as conn:
        await conn.run_sync(UUIDBase.metadata.create_all)


app = Litestar(
    route_handlers=[AccountController],
    on_startup=[on_startup],
    on_app_init=[jwt_auth.on_app_init],
    plugins=[SQLAlchemyInitPlugin(config=sqlalchemy_config)],
    dependencies={"limit_offset": Provide(provide_limit_offset_pagination)},
)
