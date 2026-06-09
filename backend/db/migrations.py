from __future__ import annotations

from backend.db.connection import mongo_manager


AUDIT_LOG_TTL_SECONDS = 90 * 24 * 60 * 60


async def create_indexes() -> None:
    await mongo_manager.cases.create_index("case_reference", unique=True, name="cases_case_reference_unique")
    await mongo_manager.cases.create_index("risk_level", name="cases_risk_level")
    await mongo_manager.cases.create_index([("updated_at", -1)], name="cases_updated_at_desc")
    await mongo_manager.cases.create_index("subject_account", name="cases_subject_account")

    await mongo_manager.sar_reports.create_index("case_id", name="sar_reports_case_id")
    await mongo_manager.sar_reports.create_index("status", name="sar_reports_status")
    await mongo_manager.sar_reports.create_index([("created_at", -1)], name="sar_reports_created_at_desc")
    await mongo_manager.sar_reports.create_index("approved_at", sparse=True, name="sar_reports_approved_at")
    await mongo_manager.sar_reports.create_index("created_by", sparse=True, name="sar_reports_created_by")
    await mongo_manager.sar_reports.create_index("is_archived", name="sar_reports_is_archived")

    await mongo_manager.audit_logs.create_index("sar_id", sparse=True, name="audit_logs_sar_id")
    await mongo_manager.audit_logs.create_index("action", name="audit_logs_action")
    await mongo_manager.audit_logs.create_index([("timestamp", -1)], name="audit_logs_timestamp_desc")
    await mongo_manager.audit_logs.create_index("user_id", name="audit_logs_user_id")
    await mongo_manager.audit_logs.create_index(
        "timestamp",
        expireAfterSeconds=AUDIT_LOG_TTL_SECONDS,
        name="audit_logs_ttl_90d",
    )

    await mongo_manager.users.create_index("oauth_id", unique=True, name="users_oauth_id_unique")
    await mongo_manager.users.create_index("email", unique=True, name="users_email_unique")
    await mongo_manager.users.create_index("role", name="users_role")
