from __future__ import annotations

from bson import ObjectId
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from auth.token_service import TokenDecodeError, TokenService
from config import Settings
from db.connection import mongo_manager
from models.user_model import UserModel


def _error_response(status_code: int, code: str, message: str) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "error": {
                "code": code,
                "message": message,
                "status": status_code,
            }
        },
    )


class AuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, settings: Settings) -> None:
        super().__init__(app)
        self._settings = settings
        self._token_service = TokenService(settings)

    async def dispatch(self, request: Request, call_next):
        # Allow CORS preflight requests and exempt paths
        if request.method == "OPTIONS" or request.url.path in self._settings.auth_exempt_paths or request.url.path.startswith("/docs") or request.url.path.startswith("/openapi"):
            return await call_next(request)

        authorization = request.headers.get("Authorization", "")
        if not authorization.startswith("Bearer "):
            return _error_response(401, "AUTH_REQUIRED", "Missing bearer token.")

        token = authorization.removeprefix("Bearer ").strip()
        try:
            payload = self._token_service.decode_access_token(token)
        except TokenDecodeError as exc:
            return _error_response(401, "INVALID_TOKEN", str(exc))

        user_id = payload.get("sub")
        if not isinstance(user_id, str) or not ObjectId.is_valid(user_id):
            return _error_response(401, "INVALID_TOKEN", "Token subject is invalid.")

        user_document = await mongo_manager.users.find_one({"_id": ObjectId(user_id)})
        if not user_document:
            return _error_response(401, "INVALID_TOKEN", "Token user no longer exists.")

        user = UserModel.from_mongo(user_document)
        if not user.is_active:
            return _error_response(403, "USER_INACTIVE", "User is inactive.")

        request.state.user = user
        return await call_next(request)
