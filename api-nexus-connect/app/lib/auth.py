from datetime import timedelta

from app.services.user_service import UserService
from app.settings import AppConfig
from app.models.user import (
    User,
    UserLoginSchema,
    UserReadDTO,
    UserUpdateDTO,
    UserRegistrationDTO,
)
from app.models.role import (
    Role,
    RoleCreateDTO,
    RoleReadDTO,
    RoleUpdateDTO,
)

from litestar.security.jwt import JWTAuth, Token

from litestar_users import LitestarUsersConfig, LitestarUsersPlugin
from litestar_users.guards import roles_accepted
from litestar_users.config import (
    AuthHandlerConfig,
    CurrentUserHandlerConfig,
    RoleManagementHandlerConfig,
    UserManagementHandlerConfig,
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
        role_model=Role,  # pyright: ignore
        role_create_dto=RoleCreateDTO,
        role_read_dto=RoleReadDTO,
        role_update_dto=RoleUpdateDTO,
        user_service_class=UserService,  # pyright: ignore
        auth_handler_config=AuthHandlerConfig(),
        current_user_handler_config=CurrentUserHandlerConfig(),
        password_reset_handler_config=PasswordResetHandlerConfig(),
        register_handler_config=RegisterHandlerConfig(),
        role_management_handler_config=RoleManagementHandlerConfig(
            guards=[roles_accepted("admin")]
        ),
        user_management_handler_config=UserManagementHandlerConfig(),
        verification_handler_config=VerificationHandlerConfig(),
        auto_commit_transactions=True,
        default_token_expiration=timedelta(weeks=52),
        authentication_request_schema=UserLoginSchema,
        user_auth_identifier="nexus_username",
    )
)
