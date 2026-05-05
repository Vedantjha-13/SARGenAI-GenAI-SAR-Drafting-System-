from __future__ import annotations

from bson import ObjectId
from pymongo import DESCENDING

from backend.db.connection import mongo_manager
from backend.models.case_model import CaseModel


class CaseService:
    async def list_cases(self, limit: int = 100, skip: int = 0) -> list[CaseModel]:
        cursor = (
            mongo_manager.cases.find({})
            .sort("updated_at", DESCENDING)
            .skip(skip)
            .limit(limit)
        )
        documents = await cursor.to_list(length=limit)
        return [CaseModel.from_mongo(doc) for doc in documents]

    async def get_case_by_id(self, case_id: str) -> CaseModel | None:
        if not ObjectId.is_valid(case_id):
            return None
        document = await mongo_manager.cases.find_one({"_id": ObjectId(case_id)})
        if not document:
            return None
        return CaseModel.from_mongo(document)

