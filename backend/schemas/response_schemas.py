from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from backend.models.case_model import TransactionModel


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
    approved_by: str | None
    rejected_by: str | None
    rejection_reason: str | None
    created_at: datetime
    updated_at: datetime
    approved_at: datetime | None
    rejected_at: datetime | None


class OperationStatusResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sar_id: str
    status: str
    updated_at: datetime

