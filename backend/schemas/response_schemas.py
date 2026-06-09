from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from backend.models.case_model import TransactionModel
from backend.models.user_model import UserRole


class CaseSummaryResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    case_reference: str
    subject_name: str
    risk_level: str
    transaction_count: int
    updated_at: datetime


class CaseDetailResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    case_reference: str
    subject_name: str
    subject_account: str
    risk_level: str
    narrative_context: str | None
    transactions: list[TransactionModel]
    metadata: dict[str, Any]
    created_at: datetime
    updated_at: datetime


class GenerateSARResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sar_id: str
    case_id: str
    status: str
    ai_generated_text: str
    confidence_score: float = Field(ge=0.0, le=1.0)
    retrieved_context_count: int
    created_at: datetime


class SARReportResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    case_id: str
    ai_generated_text: str
    human_edited_text: str | None
    status: str
    confidence_score: float = Field(ge=0.0, le=1.0)
    retrieved_context: list[str]
    generation_metadata: dict[str, Any]
    created_by: str | None
    approved_by: str | None
    rejected_by: str | None
    rejection_reason: str | None
    is_archived: bool
    archived_at: datetime | None
    created_at: datetime
    updated_at: datetime
    approved_at: datetime | None
    rejected_at: datetime | None


class OperationStatusResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sar_id: str
    status: str
    updated_at: datetime
    message: str | None = None


class UserResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    email: str
    name: str
    role: UserRole
    oauth_provider: str
    profile_picture: str | None
    last_login: datetime | None


class AuthTokenResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse


class SARSummaryResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    case_id: str
    case_reference: str | None
    status: str
    confidence_score: float = Field(ge=0.0, le=1.0)
    created_by: str | None
    approved_by: str | None
    created_at: datetime
    updated_at: datetime
    approved_at: datetime | None


class PaginatedSARResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    items: list[SARSummaryResponse]
    total: int
    limit: int
    skip: int


class AuditLogResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    sar_id: str | None
    case_id: str | None
    user_id: str
    user_name: str
    action: str
    before_state: dict[str, Any] | None
    after_state: dict[str, Any] | None
    details: dict[str, Any]
    timestamp: datetime
