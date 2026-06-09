from __future__ import annotations

import re

from pydantic import BaseModel, ConfigDict, Field, field_validator

from backend.models.user_model import UserRole


HTML_TAG_PATTERN = re.compile(r"<[^>]+>")


def _sanitize_text(value: str | None) -> str | None:
    if value is None:
        return None
    cleaned = HTML_TAG_PATTERN.sub("", value).strip()
    return cleaned or None


class GenerateSARRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    case_id: str = Field(min_length=1)
    analyst_notes: str | None = Field(default=None, max_length=4000)

    @field_validator("case_id")
    @classmethod
    def validate_case_id(cls, value: str) -> str:
        return value.strip()

    @field_validator("analyst_notes")
    @classmethod
    def sanitize_analyst_notes(cls, value: str | None) -> str | None:
        return _sanitize_text(value)


class UpdateSARRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sar_id: str = Field(min_length=1)
    human_edited_text: str = Field(min_length=20)

    @field_validator("sar_id")
    @classmethod
    def validate_sar_id(cls, value: str) -> str:
        return value.strip()

    @field_validator("human_edited_text")
    @classmethod
    def sanitize_human_edited_text(cls, value: str) -> str:
        sanitized = _sanitize_text(value)
        if not sanitized:
            raise ValueError("Edited SAR text cannot be empty.")
        return sanitized


class ApproveSARRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sar_id: str = Field(min_length=1)
    approved_by: str | None = Field(default=None, max_length=200)

    @field_validator("sar_id")
    @classmethod
    def validate_approve_sar_id(cls, value: str) -> str:
        return value.strip()


class RejectSARRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sar_id: str = Field(min_length=1)
    rejected_by: str | None = Field(default=None, max_length=200)
    rejection_reason: str | None = Field(default=None, max_length=2000)

    @field_validator("sar_id")
    @classmethod
    def validate_reject_sar_id(cls, value: str) -> str:
        return value.strip()

    @field_validator("rejection_reason")
    @classmethod
    def sanitize_rejection_reason(cls, value: str | None) -> str | None:
        return _sanitize_text(value)


class RegenerateSARRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    analyst_notes: str | None = Field(default=None, max_length=4000)

    @field_validator("analyst_notes")
    @classmethod
    def sanitize_regeneration_notes(cls, value: str | None) -> str | None:
        return _sanitize_text(value)


class LoginRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: str = Field(min_length=3, max_length=320)
    name: str = Field(min_length=2, max_length=200)
    role: UserRole = UserRole.analyst
    provider: str = Field(default="local", min_length=2, max_length=50)
    oauth_id: str | None = Field(default=None, max_length=200)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        email = value.strip().lower()
        if "@" not in email or "." not in email.split("@")[-1]:
            raise ValueError("A valid email address is required.")
        return email

    @field_validator("name", "provider", "oauth_id")
    @classmethod
    def sanitize_identity_fields(cls, value: str | None) -> str | None:
        return _sanitize_text(value)
