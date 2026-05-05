from pydantic import BaseModel, ConfigDict, Field


class GenerateSARRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    case_id: str = Field(min_length=1)
    analyst_notes: str | None = Field(default=None, max_length=4000)


class UpdateSARRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sar_id: str = Field(min_length=1)
    human_edited_text: str = Field(min_length=20)


class ApproveSARRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sar_id: str = Field(min_length=1)
    approved_by: str | None = Field(default=None, max_length=200)


class RejectSARRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sar_id: str = Field(min_length=1)
    rejected_by: str | None = Field(default=None, max_length=200)
    rejection_reason: str | None = Field(default=None, max_length=2000)

