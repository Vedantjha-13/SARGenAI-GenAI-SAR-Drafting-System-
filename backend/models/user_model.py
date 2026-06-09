from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any

from bson import ObjectId
from pydantic import BaseModel, ConfigDict, Field


class UserRole(str, Enum):
    analyst = "analyst"
    supervisor = "supervisor"
    admin = "admin"


class UserModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    id: str | None = Field(default=None, alias="_id")
    oauth_provider: str = "local"
    oauth_id: str
    email: str
    name: str
    profile_picture: str | None = None
    role: UserRole = UserRole.analyst
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: datetime | None = None

    @classmethod
    def from_mongo(cls, document: dict[str, Any]) -> "UserModel":
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
