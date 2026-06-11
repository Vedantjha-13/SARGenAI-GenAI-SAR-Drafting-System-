from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status

from backend.auth.rbac import require_role
from backend.exceptions.error_responses import AppError
from backend.models.sar_model import SARReportModel
from backend.models.user_model import UserModel, UserRole
from backend.schemas.request_schemas import (
    ApproveSARRequest,
    GenerateSARRequest,
    RegenerateSARRequest,
    RejectSARRequest,
    UpdateSARRequest,
)
from backend.schemas.response_schemas import (
    GenerateSARResponse,
    OperationStatusResponse,
    PaginatedSARResponse,
    SARReportResponse,
    SARSummaryResponse,
)
from backend.services.ai_service import AIService
from backend.services.case_service import CaseService

logger = logging.getLogger(__name__)
router = APIRouter(tags=["SAR"])


def get_ai_service(request: Request) -> AIService:
    return request.app.state.ai_service


def get_case_service(request: Request) -> CaseService:
    return request.app.state.case_service


def _ensure_sar_access(report: SARReportModel, user: UserModel) -> None:
    if user.role == UserRole.analyst and report.created_by and report.created_by != user.id:
        raise AppError.forbidden("SAR_ACCESS_DENIED", "Analysts can only access SARs they created.")


@router.post("/generate-sar", response_model=GenerateSARResponse, status_code=status.HTTP_201_CREATED)
async def generate_sar(
    payload: GenerateSARRequest,
    current_user: UserModel = Depends(require_role(UserRole.analyst)),
    ai_service: AIService = Depends(get_ai_service),
    case_service: CaseService = Depends(get_case_service),
) -> GenerateSARResponse:
    case = await case_service.get_case_by_id(payload.case_id)
    if not case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found.")

    try:
        report = await ai_service.generate_sar(
            case=case,
            analyst_notes=payload.analyst_notes,
            created_by=current_user,
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Unexpected error during SAR generation")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"SAR generation failed: {exc}",
        ) from exc

    return GenerateSARResponse(
        sar_id=report.id or "",
        case_id=report.case_id,
        status=report.status,
        ai_generated_text=report.ai_generated_text,
        confidence_score=report.confidence_score,
        retrieved_context_count=len(report.retrieved_context),
        created_at=report.created_at,
    )


@router.post("/update-sar", response_model=OperationStatusResponse)
async def update_sar(
    payload: UpdateSARRequest,
    current_user: UserModel = Depends(require_role(UserRole.analyst)),
    ai_service: AIService = Depends(get_ai_service),
) -> OperationStatusResponse:
    existing = await ai_service.get_sar_by_id(payload.sar_id)
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SAR report not found.")
    _ensure_sar_access(existing, current_user)

    report = await ai_service.update_sar(
        payload.sar_id,
        payload.human_edited_text,
        acting_user=current_user,
    )
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SAR report not found.")
    return OperationStatusResponse(
        sar_id=report.id or "",
        status=report.status,
        updated_at=report.updated_at,
        message="SAR draft updated.",
    )


@router.post("/approve-sar", response_model=OperationStatusResponse)
async def approve_sar(
    payload: ApproveSARRequest,
    current_user: UserModel = Depends(require_role(UserRole.supervisor)),
    ai_service: AIService = Depends(get_ai_service),
) -> OperationStatusResponse:
    report = await ai_service.approve_sar(
        payload.sar_id,
        approved_by=payload.approved_by or current_user.name,
        acting_user=current_user,
    )
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SAR report not found.")
    return OperationStatusResponse(
        sar_id=report.id or "",
        status=report.status,
        updated_at=report.updated_at,
        message="SAR approved.",
    )


@router.post("/reject-sar", response_model=OperationStatusResponse)
async def reject_sar(
    payload: RejectSARRequest,
    current_user: UserModel = Depends(require_role(UserRole.supervisor)),
    ai_service: AIService = Depends(get_ai_service),
) -> OperationStatusResponse:
    report = await ai_service.reject_sar(
        payload.sar_id,
        rejected_by=payload.rejected_by or current_user.name,
        rejection_reason=payload.rejection_reason,
        acting_user=current_user,
    )
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SAR report not found.")
    return OperationStatusResponse(
        sar_id=report.id or "",
        status=report.status,
        updated_at=report.updated_at,
        message="SAR rejected.",
    )


@router.get("/sars/history", response_model=PaginatedSARResponse)
async def get_sar_history(
    status_filter: str | None = Query(default=None, alias="status"),
    created_by: str | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=500),
    skip: int = Query(default=0, ge=0),
    current_user: UserModel = Depends(require_role(UserRole.analyst)),
    ai_service: AIService = Depends(get_ai_service),
    case_service: CaseService = Depends(get_case_service),
) -> PaginatedSARResponse:
    if current_user.role == UserRole.analyst:
        created_by = current_user.id

    reports, total = await ai_service.list_sars(
        status=status_filter,
        created_by=created_by,
        limit=limit,
        skip=skip,
    )
    case_refs = await case_service.get_case_references([report.case_id for report in reports])
    return PaginatedSARResponse(
        items=[
            SARSummaryResponse(
                id=report.id or "",
                case_id=report.case_id,
                case_reference=case_refs.get(report.case_id),
                status=report.status,
                confidence_score=report.confidence_score,
                created_by=report.created_by,
                approved_by=report.approved_by,
                created_at=report.created_at,
                updated_at=report.updated_at,
                approved_at=report.approved_at,
            )
            for report in reports
        ],
        total=total,
        limit=limit,
        skip=skip,
    )


@router.get("/sars", response_model=PaginatedSARResponse)
async def list_sars(
    status_filter: str | None = Query(default=None, alias="status"),
    created_by: str | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=500),
    skip: int = Query(default=0, ge=0),
    current_user: UserModel = Depends(require_role(UserRole.analyst)),
    ai_service: AIService = Depends(get_ai_service),
    case_service: CaseService = Depends(get_case_service),
) -> PaginatedSARResponse:
    if current_user.role == UserRole.analyst:
        created_by = current_user.id

    reports, total = await ai_service.list_sars(
        status=status_filter,
        created_by=created_by,
        limit=limit,
        skip=skip,
    )
    case_refs = await case_service.get_case_references([report.case_id for report in reports])
    return PaginatedSARResponse(
        items=[
            SARSummaryResponse(
                id=report.id or "",
                case_id=report.case_id,
                case_reference=case_refs.get(report.case_id),
                status=report.status,
                confidence_score=report.confidence_score,
                created_by=report.created_by,
                approved_by=report.approved_by,
                created_at=report.created_at,
                updated_at=report.updated_at,
                approved_at=report.approved_at,
            )
            for report in reports
        ],
        total=total,
        limit=limit,
        skip=skip,
    )


@router.post("/sars/{sar_id}/regenerate", response_model=GenerateSARResponse, status_code=status.HTTP_201_CREATED)
async def regenerate_sar(
    sar_id: str,
    payload: RegenerateSARRequest,
    current_user: UserModel = Depends(require_role(UserRole.analyst)),
    ai_service: AIService = Depends(get_ai_service),
    case_service: CaseService = Depends(get_case_service),
) -> GenerateSARResponse:
    existing = await ai_service.get_sar_by_id(sar_id)
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SAR report not found.")
    _ensure_sar_access(existing, current_user)

    case = await case_service.get_case_by_id(existing.case_id)
    if not case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found.")

    report = await ai_service.generate_sar(
        case=case,
        analyst_notes=payload.analyst_notes,
        created_by=current_user,
        generation_overrides={"regenerated_from": sar_id},
    )
    return GenerateSARResponse(
        sar_id=report.id or "",
        case_id=report.case_id,
        status=report.status,
        ai_generated_text=report.ai_generated_text,
        confidence_score=report.confidence_score,
        retrieved_context_count=len(report.retrieved_context),
        created_at=report.created_at,
    )


@router.delete("/sars/{sar_id}", response_model=OperationStatusResponse)
async def archive_sar(
    sar_id: str,
    current_user: UserModel = Depends(require_role(UserRole.supervisor)),
    ai_service: AIService = Depends(get_ai_service),
) -> OperationStatusResponse:
    report = await ai_service.archive_sar(sar_id, acting_user=current_user)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SAR report not found.")
    return OperationStatusResponse(
        sar_id=report.id or "",
        status=report.status,
        updated_at=report.updated_at,
        message="SAR archived.",
    )


@router.get("/sars/{sar_id}", response_model=SARReportResponse)
@router.get("/sar/{sar_id}", response_model=SARReportResponse, include_in_schema=False)
async def get_sar(
    sar_id: str,
    current_user: UserModel = Depends(require_role(UserRole.analyst)),
    ai_service: AIService = Depends(get_ai_service),
) -> SARReportResponse:
    report = await ai_service.get_sar_by_id(sar_id)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SAR report not found.")
    _ensure_sar_access(report, current_user)

    return SARReportResponse(
        id=report.id or "",
        case_id=report.case_id,
        ai_generated_text=report.ai_generated_text,
        human_edited_text=report.human_edited_text,
        status=report.status,
        confidence_score=report.confidence_score,
        retrieved_context=report.retrieved_context,
        generation_metadata=report.generation_metadata,
        created_by=report.created_by,
        approved_by=report.approved_by,
        rejected_by=report.rejected_by,
        rejection_reason=report.rejection_reason,
        is_archived=report.is_archived,
        archived_at=report.archived_at,
        created_at=report.created_at,
        updated_at=report.updated_at,
        approved_at=report.approved_at,
        rejected_at=report.rejected_at,
    )
