from __future__ import annotations

from datetime import datetime
from typing import Any

from fastapi import status


class AppError(Exception):
    def __init__(
        self,
        code: str,
        message: str,
        status_code: int,
        details: dict[str, Any] | None = None,
    ) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details or {}

    @classmethod
    def bad_request(cls, code: str, message: str, details: dict[str, Any] | None = None) -> "AppError":
        return cls(code, message, status.HTTP_400_BAD_REQUEST, details)

    @classmethod
    def unauthorized(cls, code: str, message: str, details: dict[str, Any] | None = None) -> "AppError":
        return cls(code, message, status.HTTP_401_UNAUTHORIZED, details)

    @classmethod
    def forbidden(cls, code: str, message: str, details: dict[str, Any] | None = None) -> "AppError":
        return cls(code, message, status.HTTP_403_FORBIDDEN, details)

    @classmethod
    def not_found(cls, code: str, message: str, details: dict[str, Any] | None = None) -> "AppError":
        return cls(code, message, status.HTTP_404_NOT_FOUND, details)


def build_error_content(code: str, message: str, status_code: int, details: dict[str, Any] | None = None) -> dict[str, Any]:
    return {
        "error": {
            "code": code,
            "message": message,
            "status": status_code,
            "timestamp": datetime.utcnow().isoformat(),
            "details": details or {},
        }
    }
