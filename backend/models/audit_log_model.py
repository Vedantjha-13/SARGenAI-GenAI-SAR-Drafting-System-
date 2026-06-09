from __future__ import annotations

from datetime import datetime
from typing import Any

from bson import ObjectId
from pydantic import BaseModel, ConfigDict, Field


class AuditLogModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    id: str | None = Field(default=None, alias="_id")
    sar_id: str | None = None
    case_id: str | None = None
    user_id: str
    user_name: str
    action: str
    before_state: dict[str, Any] | None = None
    after_state: dict[str, Any] | None = None
    details: dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    @classmethod
    def from_mongo(cls, document: dict[str, Any]) -> "AuditLogModel":
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
