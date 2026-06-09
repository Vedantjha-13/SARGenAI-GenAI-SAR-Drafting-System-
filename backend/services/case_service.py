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

    async def get_case_references(self, case_ids: list[str]) -> dict[str, str]:
        object_ids = [ObjectId(case_id) for case_id in case_ids if ObjectId.is_valid(case_id)]
        if not object_ids:
            return {}

        documents = await mongo_manager.cases.find(
            {"_id": {"$in": object_ids}},
            {"case_reference": 1},
        ).to_list(length=len(object_ids))
        return {str(doc["_id"]): doc.get("case_reference", "") for doc in documents}
