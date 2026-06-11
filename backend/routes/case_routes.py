from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status

from auth.rbac import require_role
from models.user_model import UserModel, UserRole
from schemas.response_schemas import CaseDetailResponse, CaseSummaryResponse
from services.case_service import CaseService

router = APIRouter(tags=["Cases"])


def get_case_service(request: Request) -> CaseService:
    return request.app.state.case_service


@router.get("/cases", response_model=list[CaseSummaryResponse])
async def get_cases(
    limit: int = Query(default=100, ge=1, le=500),
    skip: int = Query(default=0, ge=0),
    _: UserModel = Depends(require_role(UserRole.analyst)),
    case_service: CaseService = Depends(get_case_service),
) -> list[CaseSummaryResponse]:
    cases = await case_service.list_cases(limit=limit, skip=skip)
    return [
        CaseSummaryResponse(
            id=case.id or "",
            case_reference=case.case_reference,
            subject_name=case.subject_name,
            risk_level=case.risk_level,
            transaction_count=len(case.transactions),
            updated_at=case.updated_at,
        )
        for case in cases
    ]


@router.get("/case/{case_id}", response_model=CaseDetailResponse)
async def get_case(
    case_id: str,
    _: UserModel = Depends(require_role(UserRole.analyst)),
    case_service: CaseService = Depends(get_case_service),
) -> CaseDetailResponse:
    case = await case_service.get_case_by_id(case_id)
    if not case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found.")

    return CaseDetailResponse(
        id=case.id or "",
        case_reference=case.case_reference,
        subject_name=case.subject_name,
        subject_account=case.subject_account,
        risk_level=case.risk_level,
        narrative_context=case.narrative_context,
        transactions=case.transactions,
        metadata=case.metadata,
        created_at=case.created_at,
        updated_at=case.updated_at,
    )
