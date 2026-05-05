from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, Request, status

from backend.schemas.request_schemas import (
    ApproveSARRequest,
    GenerateSARRequest,
    RejectSARRequest,
    UpdateSARRequest,
)
from backend.schemas.response_schemas import (
    GenerateSARResponse,
    OperationStatusResponse,
    SARReportResponse,
)
from backend.services.ai_service import AIService
from backend.services.case_service import CaseService

logger = logging.getLogger(__name__)
router = APIRouter(tags=["SAR"])


def get_ai_service(request: Request) -> AIService:
    return request.app.state.ai_service


def get_case_service(request: Request) -> CaseService:
    return request.app.state.case_service


@router.post("/generate-sar", response_model=GenerateSARResponse, status_code=status.HTTP_201_CREATED)
async def generate_sar(
    payload: GenerateSARRequest,
    ai_service: AIService = Depends(get_ai_service),
    case_service: CaseService = Depends(get_case_service),
) -> GenerateSARResponse:
    case = await case_service.get_case_by_id(payload.case_id)
    if not case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found.")

    try:
        report = await ai_service.generate_sar(case=case, analyst_notes=payload.analyst_notes)
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Unexpected error during SAR generation")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SAR generation failed.",
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
    ai_service: AIService = Depends(get_ai_service),
) -> OperationStatusResponse:
    report = await ai_service.update_sar(payload.sar_id, payload.human_edited_text)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SAR report not found.")
    return OperationStatusResponse(sar_id=report.id or "", status=report.status, updated_at=report.updated_at)


@router.post("/approve-sar", response_model=OperationStatusResponse)
async def approve_sar(
    payload: ApproveSARRequest,
    ai_service: AIService = Depends(get_ai_service),
) -> OperationStatusResponse:
    report = await ai_service.approve_sar(payload.sar_id, approved_by=payload.approved_by)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SAR report not found.")
    return OperationStatusResponse(sar_id=report.id or "", status=report.status, updated_at=report.updated_at)


@router.post("/reject-sar", response_model=OperationStatusResponse)
async def reject_sar(
    payload: RejectSARRequest,
    ai_service: AIService = Depends(get_ai_service),
) -> OperationStatusResponse:
    report = await ai_service.reject_sar(
        payload.sar_id,
        rejected_by=payload.rejected_by,
        rejection_reason=payload.rejection_reason,
    )
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SAR report not found.")
    return OperationStatusResponse(sar_id=report.id or "", status=report.status, updated_at=report.updated_at)


@router.get("/sar/{sar_id}", response_model=SARReportResponse)
async def get_sar(
    sar_id: str,
    ai_service: AIService = Depends(get_ai_service),
) -> SARReportResponse:
    report = await ai_service.get_sar_by_id(sar_id)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SAR report not found.")

    return SARReportResponse(
        id=report.id or "",
        case_id=report.case_id,
        ai_generated_text=report.ai_generated_text,
        human_edited_text=report.human_edited_text,
        status=report.status,
        confidence_score=report.confidence_score,
        retrieved_context=report.retrieved_context,
        generation_metadata=report.generation_metadata,
        approved_by=report.approved_by,
        rejected_by=report.rejected_by,
        rejection_reason=report.rejection_reason,
        created_at=report.created_at,
        updated_at=report.updated_at,
        approved_at=report.approved_at,
        rejected_at=report.rejected_at,
    )

