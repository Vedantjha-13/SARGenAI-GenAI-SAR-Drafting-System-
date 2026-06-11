from __future__ import annotations

fromdb.connection import mongo_manager
frommodels.audit_log_model import AuditLogModel
frommodels.user_model import UserModel


class AuditService:
    async def log_event(
        self,
        *,
        user: UserModel,
        action: str,
        sar_id: str | None = None,
        case_id: str | None = None,
        before_state: dict | None = None,
        after_state: dict | None = None,
        details: dict | None = None,
    ) -> AuditLogModel:
        entry = AuditLogModel(
            sar_id=sar_id,
            case_id=case_id,
            user_id=user.id or "",
            user_name=user.name,
            action=action,
            before_state=before_state,
            after_state=after_state,
            details=details or {},
        )
        inserted = await mongo_manager.audit_logs.insert_one(entry.to_mongo())
        entry.id = str(inserted.inserted_id)
        return entry

    async def list_logs(
        self,
        *,
        sar_id: str | None = None,
        user_id: str | None = None,
        action: str | None = None,
        limit: int = 100,
        skip: int = 0,
    ) -> list[AuditLogModel]:
        query: dict[str, str] = {}
        if sar_id:
            query["sar_id"] = sar_id
        if user_id:
            query["user_id"] = user_id
        if action:
            query["action"] = action

        cursor = mongo_manager.audit_logs.find(query).sort("timestamp", -1).skip(skip).limit(limit)
        documents = await cursor.to_list(length=limit)
        return [AuditLogModel.from_mongo(doc) for doc in documents]
