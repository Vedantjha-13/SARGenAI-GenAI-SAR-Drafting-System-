from __future__ import annotations

from datetime import datetime
from typing import Any

from bson import ObjectId
from pydantic import BaseModel, ConfigDict, Field


class SARReportModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    id: str | None = Field(default=None, alias="_id")
    case_id: str
    ai_generated_text: str
    human_edited_text: str | None = None
    status: str = "pending"
    confidence_score: float = Field(default=0.0, ge=0.0, le=1.0)
    retrieved_context: list[str] = Field(default_factory=list)
    generation_metadata: dict[str, Any] = Field(default_factory=dict)
    approved_by: str | None = None
    rejected_by: str | None = None
    rejection_reason: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    approved_at: datetime | None = None
    rejected_at: datetime | None = None

    @classmethod
    def from_mongo(cls, document: dict[str, Any]) -> "SARReportModel":
        doc = document.copy()
        if "_id" in doc:
            doc["_id"] = str(doc["_id"])
        return cls.model_validate(doc)

    def to_mongo(self) -> dict[str, Any]:
        doc = self.model_dump(by_alias=True)
        if doc.get("_id"):
            doc["_id"] = ObjectId(doc["_id"])
        else:
            doc.pop("_id", None)
        return doc

