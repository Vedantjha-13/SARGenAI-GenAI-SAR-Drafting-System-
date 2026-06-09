from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Request

from backend.auth.rbac import require_role
from backend.models.user_model import UserModel, UserRole
from backend.schemas.response_schemas import AuditLogResponse
from backend.services.audit_service import AuditService

router = APIRouter(tags=["Audit"])


def get_audit_service(request: Request) -> AuditService:
    return request.app.state.audit_service


@router.get("/audit-logs", response_model=list[AuditLogResponse])
async def get_audit_logs(
    sar_id: str | None = Query(default=None),
    user_id: str | None = Query(default=None),
    action: str | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=500),
    skip: int = Query(default=0, ge=0),
    _: UserModel = Depends(require_role(UserRole.supervisor)),
    audit_service: AuditService = Depends(get_audit_service),
) -> list[AuditLogResponse]:
    logs = await audit_service.list_logs(
        sar_id=sar_id,
        user_id=user_id,
        action=action,
        limit=limit,
        skip=skip,
    )
    return [
        AuditLogResponse(
            id=log.id or "",
            sar_id=log.sar_id,
            case_id=log.case_id,
            user_id=log.user_id,
            user_name=log.user_name,
            action=log.action,
            before_state=log.before_state,
            after_state=log.after_state,
            details=log.details,
            timestamp=log.timestamp,
        )
        for log in logs
    ]
