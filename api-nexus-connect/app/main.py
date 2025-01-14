from app.controllers.user_controller import UserController
from app.settings import AppConfig
from .controllers.mod_controller import ModController
from .controllers.profile_controller import ModProfileController
from .lib.providers import provide_limit_offset_pagination
from .lib.listeners import event_listeners
from .lib.auth import litestar_users

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
    connection_string=AppConfig.DATABASE_URL,
    session_config=session_config,
)  # Create 'db_session' dependency.
sqlalchemy_plugin = SQLAlchemyInitPlugin(config=sqlalchemy_config)


async def on_startup() -> None:
    """Initializes the database."""
    async with sqlalchemy_config.get_engine().begin() as conn:
        await conn.run_sync(UUIDBase.metadata.create_all)


app = Litestar(
    on_startup=[on_startup],
    route_handlers=[UserController, ModController, ModProfileController],
    plugins=[sqlalchemy_plugin, litestar_users],
    dependencies={"limit_offset": Provide(provide_limit_offset_pagination)},
    listeners=event_listeners,
)
