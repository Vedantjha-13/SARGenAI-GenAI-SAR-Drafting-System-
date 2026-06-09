from __future__ import annotations

from datetime import datetime
from typing import Any

from bson import ObjectId
from pydantic import BaseModel, ConfigDict, Field


class TransactionModel(BaseModel):
    model_config = ConfigDict(extra="forbid")

    transaction_id: str
    timestamp: datetime
    amount: float
    currency: str = "USD"
    transaction_type: str
    counterparty: str | None = None
    location: str | None = None
    description: str | None = None
    flags: list[str] = Field(default_factory=list)


class CaseModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    id: str | None = Field(default=None, alias="_id")
    case_reference: str
    subject_name: str
    subject_account: str
    risk_level: str = "medium"
    narrative_context: str | None = None
    transactions: list[TransactionModel] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_by: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @classmethod
    def from_mongo(cls, document: dict[str, Any]) -> "CaseModel":
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
