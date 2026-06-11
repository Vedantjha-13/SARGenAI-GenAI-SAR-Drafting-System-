from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.config import get_settings
from backend.db.connection import mongo_manager
from backend.exceptions.error_responses import AppError, build_error_content
from backend.middleware.auth import AuthMiddleware
from backend.routes.audit_routes import router as audit_router
from backend.routes.auth_routes import router as auth_router
from backend.routes.case_routes import router as case_router
from backend.routes.sar_routes import router as sar_router
from backend.services.ai_service import AIService
from backend.services.audit_service import AuditService
from backend.services.case_service import CaseService
from backend.services.rag_service import RAGService

settings = get_settings()
logging.basicConfig(
    level=settings.log_level,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting backend services")
    await mongo_manager.connect()

    rag_service = RAGService(settings)
    await rag_service.initialize()

    app.state.audit_service = AuditService()
    app.state.case_service = CaseService()
    app.state.ai_service = AIService(
        settings=settings,
        rag_service=rag_service,
        audit_service=app.state.audit_service,
    )

    yield

    logger.info("Shutting down backend services")
    await mongo_manager.disconnect()


app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(AuthMiddleware, settings=settings)
app.include_router(auth_router, prefix=settings.api_prefix)
app.include_router(case_router, prefix=settings.api_prefix)
app.include_router(sar_router, prefix=settings.api_prefix)
app.include_router(audit_router, prefix=settings.api_prefix)


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.exception_handler(AppError)
async def app_error_handler(_: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content=build_error_content(exc.code, exc.message, exc.status_code, exc.details),
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=build_error_content(
            "VALIDATION_ERROR",
            "The request payload is invalid.",
            status.HTTP_400_BAD_REQUEST,
            {"issues": exc.errors()},
        ),
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
    detail = exc.detail if isinstance(exc.detail, str) else "Request failed."
    return JSONResponse(
        status_code=exc.status_code,
        content=build_error_content(
            f"HTTP_{exc.status_code}",
            detail,
            exc.status_code,
        ),
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(_: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled error: %s", exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=build_error_content(
            "INTERNAL_SERVER_ERROR",
            "Internal server error.",
            status.HTTP_500_INTERNAL_SERVER_ERROR,
        ),
    )
