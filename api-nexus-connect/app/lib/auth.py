from app.settings import AppConfig
from app.models.user import (
    User,
    UserReadDTO,
    UserUpdateDTO,
    UserRegistrationDTO,
    UserService,
)

from litestar.security.jwt import JWTAuth, Token

from litestar_users import LitestarUsersConfig, LitestarUsersPlugin
from litestar_users.config import (
    AuthHandlerConfig,
    CurrentUserHandlerConfig,
    PasswordResetHandlerConfig,
    RegisterHandlerConfig,
    VerificationHandlerConfig,
)

__all__ = ["litestar_users"]


class JWTAuthWrapper(JWTAuth[User, Token]):
    """fixes isSubclass bug for JWTAuth being passed into auth_backend_class"""


litestar_users = LitestarUsersPlugin(
    config=LitestarUsersConfig(
        auth_backend_class=JWTAuthWrapper,
        secret=AppConfig.JWT_SECRET,
        user_model=User,
        user_read_dto=UserReadDTO,
        user_registration_dto=UserRegistrationDTO,
        user_update_dto=UserUpdateDTO,
        user_service_class=UserService,  # pyright: ignore
        auth_handler_config=AuthHandlerConfig(),
        current_user_handler_config=CurrentUserHandlerConfig(),
        password_reset_handler_config=PasswordResetHandlerConfig(),
        register_handler_config=RegisterHandlerConfig(),
        # user_management_handler_config=UserManagementHandlerConfig(
        #     guards=[example_authorization_guard]
        # ),
        verification_handler_config=VerificationHandlerConfig(),
        auto_commit_transactions=True,
    )
)
