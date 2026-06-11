from __future__ import annotations

import base64
import hashlib
import hmac
import json
from datetime import datetime, timedelta, timezone
from typing import Any

from config import Settings
from models.user_model import UserModel


class TokenDecodeError(ValueError):
    pass


def _b64url_encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("ascii")


def _b64url_decode(raw: str) -> bytes:
    padding = "=" * (-len(raw) % 4)
    return base64.urlsafe_b64decode(f"{raw}{padding}".encode("ascii"))


class TokenService:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._secret = settings.auth_secret_key.encode("utf-8")

    def create_access_token(self, user: UserModel) -> tuple[str, int]:
        now = datetime.now(timezone.utc)
        expires_at = now + timedelta(minutes=self._settings.auth_token_ttl_minutes)
        payload = {
            "sub": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role.value,
            "provider": user.oauth_provider,
            "exp": int(expires_at.timestamp()),
            "iat": int(now.timestamp()),
        }
        header = {"alg": "HS256", "typ": "JWT"}
        encoded_header = _b64url_encode(json.dumps(header, separators=(",", ":"), sort_keys=True).encode("utf-8"))
        encoded_payload = _b64url_encode(json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8"))
        signature = hmac.new(
            self._secret,
            f"{encoded_header}.{encoded_payload}".encode("ascii"),
            hashlib.sha256,
        ).digest()
        token = f"{encoded_header}.{encoded_payload}.{_b64url_encode(signature)}"
        return token, int((expires_at - now).total_seconds())

    def decode_access_token(self, token: str) -> dict[str, Any]:
        parts = token.split(".")
        if len(parts) != 3:
            raise TokenDecodeError("Malformed token.")

        encoded_header, encoded_payload, encoded_signature = parts
        expected_signature = hmac.new(
            self._secret,
            f"{encoded_header}.{encoded_payload}".encode("ascii"),
            hashlib.sha256,
        ).digest()
        actual_signature = _b64url_decode(encoded_signature)
        if not hmac.compare_digest(actual_signature, expected_signature):
            raise TokenDecodeError("Invalid token signature.")

        payload = json.loads(_b64url_decode(encoded_payload))
        expires_at = payload.get("exp")
        if not isinstance(expires_at, int):
            raise TokenDecodeError("Token missing expiry.")
        if expires_at < int(datetime.now(timezone.utc).timestamp()):
            raise TokenDecodeError("Token expired.")
        return payload
