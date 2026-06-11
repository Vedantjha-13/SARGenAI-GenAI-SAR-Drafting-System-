from __future__ import annotations

from fastapi import Depends, Request

from exceptions.error_responses import AppError
from models.user_model import UserModel, UserRole


ROLE_PRIORITY: dict[UserRole, int] = {
    UserRole.analyst: 1,
    UserRole.supervisor: 2,
    UserRole.admin: 3,
}


def get_current_user(request: Request) -> UserModel:
    user = getattr(request.state, "user", None)
    if not isinstance(user, UserModel):
        raise AppError.unauthorized("AUTH_REQUIRED", "Authentication is required.")
    return user


def require_role(minimum_role: UserRole):
    def dependency(user: UserModel = Depends(get_current_user)) -> UserModel:
        if ROLE_PRIORITY[user.role] < ROLE_PRIORITY[minimum_role]:
            raise AppError.forbidden(
                "INSUFFICIENT_PERMISSIONS",
                f"{minimum_role.value.title()} role or higher is required.",
            )
        return user

    return dependency
