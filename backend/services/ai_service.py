from __future__ import annotations

import asyncio
import logging
from datetime import datetime

from bson import ObjectId
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from pymongo import DESCENDING

fromconfig import Settings
fromdb.connection import mongo_manager
frommodels.case_model import CaseModel
frommodels.sar_model import SARReportModel
frommodels.user_model import UserModel
fromservices.audit_service import AuditService
fromservices.rag_service import RAGService

logger = logging.getLogger(__name__)


class SARGenerationOutput(BaseModel):
    sar_draft: str = Field(min_length=80)
    confidence_score: float = Field(ge=0.0, le=1.0)
    rationale: str


class AIService:
    def __init__(
        self,
        settings: Settings,
        rag_service: RAGService,
        audit_service: AuditService | None = None,
    ) -> None:
        self._settings = settings
        self._rag_service = rag_service
        self._audit_service = audit_service
        self._prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    (
                        "You are an AML compliance analyst that drafts Suspicious Activity Reports. "
                        "Use only the provided case facts and retrieved compliance context. "
                        "Do not fabricate names, dates, entities, legal conclusions, or events. "
                        "If details are missing, explicitly write 'INSUFFICIENT_INFORMATION'. "
                        "Write a professional SAR narrative with sections: Subject, Activity Summary, "
                        "Transactional Evidence, Risk Indicators, and Filing Recommendation. "
                        "Keep language neutral and factual."
                    ),
                ),
                (
                    "human",
                    (
                        "Case Facts:\n{case_facts}\n\n"
                        "Compliance Context:\n{compliance_context}\n\n"
                        "Analyst Notes:\n{analyst_notes}\n\n"
                        "Return JSON with keys: sar_draft, confidence_score, rationale."
                    ),
                ),
            ]
        )

    async def generate_sar(
        self,
        case: CaseModel,
        analyst_notes: str | None = None,
        created_by: UserModel | None = None,
        generation_overrides: dict | None = None,
    ) -> SARReportModel:
        if not self._settings.openai_api_key:
            raise RuntimeError("OPENAI_API_KEY is not configured.")

        compliance_context = await self._rag_service.retrieve_context(
            query=f"{case.case_reference} {case.risk_level} AML suspicious activity"
        )
        compliance_text = "\n\n".join(compliance_context) if compliance_context else "No context retrieved."

        try:
            llm = ChatOpenAI(
                model=self._settings.openai_model,
                api_key=self._settings.openai_api_key,
                temperature=0,
            ).with_structured_output(SARGenerationOutput)

            chain = self._prompt | llm
            result = await asyncio.wait_for(
                chain.ainvoke(
                    {
                        "case_facts": self._format_case_facts(case),
                        "compliance_context": compliance_text,
                        "analyst_notes": analyst_notes or "None",
                    }
                ),
                timeout=90,
            )
            generation_source = "openai"
            fallback_reason = None
        except Exception as exc:
            logger.warning("OpenAI SAR generation failed; using local fallback: %s", exc)
            result = SARGenerationOutput(
                sar_draft=self._build_fallback_draft(
                    case=case,
                    analyst_notes=analyst_notes,
                    compliance_context=compliance_context,
                ),
                confidence_score=self._fallback_confidence(
                    case=case,
                    analyst_notes=analyst_notes,
                    compliance_context=compliance_context,
                ),
                rationale="Local SAR draft generated because the OpenAI call was unavailable.",
            )
            generation_source = "fallback"
            fallback_reason = str(exc)

        now = datetime.utcnow()
        report = SARReportModel(
            case_id=case.id or "",
            ai_generated_text=result.sar_draft.strip(),
            confidence_score=result.confidence_score,
            retrieved_context=compliance_context,
            generation_metadata={
                "model": self._settings.openai_model,
                "rationale": result.rationale,
                "generated_at": now.isoformat(),
                "source": generation_source,
                **({"fallback_reason": fallback_reason} if fallback_reason else {}),
                **(generation_overrides or {}),
            },
            created_by=created_by.id if created_by else None,
            status="pending",
            created_at=now,
            updated_at=now,
        )

        inserted = await mongo_manager.sar_reports.insert_one(report.to_mongo())
        report.id = str(inserted.inserted_id)
        if created_by and self._audit_service:
            await self._audit_service.log_event(
                user=created_by,
                action="sar.generated",
                sar_id=report.id,
                case_id=report.case_id,
                after_state=self._serialize_report(report),
                details={"analyst_notes_present": bool(analyst_notes)},
            )
        return report

    async def get_sar_by_id(self, sar_id: str, include_archived: bool = True) -> SARReportModel | None:
        if not ObjectId.is_valid(sar_id):
            return None
        query: dict[str, object] = {"_id": ObjectId(sar_id)}
        if not include_archived:
            query["is_archived"] = {"$ne": True}
        document = await mongo_manager.sar_reports.find_one(query)
        if not document:
            return None
        return SARReportModel.from_mongo(document)

    async def list_sars(
        self,
        *,
        status: str | None = None,
        created_by: str | None = None,
        limit: int = 100,
        skip: int = 0,
        include_archived: bool = False,
    ) -> tuple[list[SARReportModel], int]:
        query: dict[str, object] = {}
        if not include_archived:
            query["is_archived"] = {"$ne": True}
        if status:
            query["status"] = status
        if created_by:
            query["created_by"] = created_by

        cursor = mongo_manager.sar_reports.find(query).sort("created_at", DESCENDING).skip(skip).limit(limit)
        documents = await cursor.to_list(length=limit)
        total = await mongo_manager.sar_reports.count_documents(query)
        return [SARReportModel.from_mongo(doc) for doc in documents], total

    async def update_sar(
        self,
        sar_id: str,
        human_edited_text: str,
        acting_user: UserModel | None = None,
    ) -> SARReportModel | None:
        if not ObjectId.is_valid(sar_id):
            return None

        existing = await self.get_sar_by_id(sar_id)
        if not existing:
            return None

        now = datetime.utcnow()
        update = {
            "$set": {
                "human_edited_text": human_edited_text,
                "updated_at": now,
            }
        }
        await mongo_manager.sar_reports.update_one({"_id": ObjectId(sar_id)}, update)
        report = await self.get_sar_by_id(sar_id)
        if report and acting_user and self._audit_service:
            await self._audit_service.log_event(
                user=acting_user,
                action="sar.updated",
                sar_id=report.id,
                case_id=report.case_id,
                before_state=self._serialize_report(existing),
                after_state=self._serialize_report(report),
            )
        return report

    async def approve_sar(
        self,
        sar_id: str,
        approved_by: str | None = None,
        acting_user: UserModel | None = None,
    ) -> SARReportModel | None:
        if not ObjectId.is_valid(sar_id):
            return None

        existing = await self.get_sar_by_id(sar_id)
        if not existing:
            return None

        now = datetime.utcnow()
        update = {
            "$set": {
                "status": "approved",
                "approved_by": approved_by,
                "approved_at": now,
                "updated_at": now,
            }
        }
        await mongo_manager.sar_reports.update_one({"_id": ObjectId(sar_id)}, update)
        report = await self.get_sar_by_id(sar_id)
        if report and acting_user and self._audit_service:
            await self._audit_service.log_event(
                user=acting_user,
                action="sar.approved",
                sar_id=report.id,
                case_id=report.case_id,
                before_state=self._serialize_report(existing),
                after_state=self._serialize_report(report),
            )
        return report

    async def reject_sar(
        self,
        sar_id: str,
        rejected_by: str | None = None,
        rejection_reason: str | None = None,
        acting_user: UserModel | None = None,
    ) -> SARReportModel | None:
        if not ObjectId.is_valid(sar_id):
            return None

        existing = await self.get_sar_by_id(sar_id)
        if not existing:
            return None

        now = datetime.utcnow()
        update = {
            "$set": {
                "status": "rejected",
                "rejected_by": rejected_by,
                "rejection_reason": rejection_reason,
                "rejected_at": now,
                "updated_at": now,
            }
        }
        await mongo_manager.sar_reports.update_one({"_id": ObjectId(sar_id)}, update)
        report = await self.get_sar_by_id(sar_id)
        if report and acting_user and self._audit_service:
            await self._audit_service.log_event(
                user=acting_user,
                action="sar.rejected",
                sar_id=report.id,
                case_id=report.case_id,
                before_state=self._serialize_report(existing),
                after_state=self._serialize_report(report),
            )
        return report

    async def archive_sar(
        self,
        sar_id: str,
        acting_user: UserModel | None = None,
    ) -> SARReportModel | None:
        if not ObjectId.is_valid(sar_id):
            return None

        existing = await self.get_sar_by_id(sar_id)
        if not existing:
            return None

        now = datetime.utcnow()
        await mongo_manager.sar_reports.update_one(
            {"_id": ObjectId(sar_id)},
            {
                "$set": {
                    "is_archived": True,
                    "archived_at": now,
                    "updated_at": now,
                }
            },
        )
        report = await self.get_sar_by_id(sar_id)
        if report and acting_user and self._audit_service:
            await self._audit_service.log_event(
                user=acting_user,
                action="sar.archived",
                sar_id=report.id,
                case_id=report.case_id,
                before_state=self._serialize_report(existing),
                after_state=self._serialize_report(report),
            )
        return report

    @staticmethod
    def _serialize_report(report: SARReportModel) -> dict:
        return report.model_dump(mode="json")

    @staticmethod
    def _format_case_facts(case: CaseModel) -> str:
        tx_lines: list[str] = []
        for tx in case.transactions[:100]:
            tx_lines.append(
                (
                    f"- tx_id={tx.transaction_id}; time={tx.timestamp.isoformat()}; amount={tx.amount} {tx.currency}; "
                    f"type={tx.transaction_type}; counterparty={tx.counterparty or 'UNKNOWN'}; "
                    f"location={tx.location or 'UNKNOWN'}; flags={','.join(tx.flags) if tx.flags else 'NONE'}; "
                    f"description={tx.description or 'N/A'}"
                )
            )
        transactions_text = "\n".join(tx_lines) if tx_lines else "- No transactions available."
        return (
            f"case_reference={case.case_reference}\n"
            f"subject_name={case.subject_name}\n"
            f"subject_account={case.subject_account}\n"
            f"risk_level={case.risk_level}\n"
            f"narrative_context={case.narrative_context or 'N/A'}\n"
            f"transactions:\n{transactions_text}"
        )

    @staticmethod
    def _build_fallback_draft(
        *,
        case: CaseModel,
        analyst_notes: str | None,
        compliance_context: list[str],
    ) -> str:
        transactions = case.transactions[:5]
        tx_lines = []
        for transaction in transactions:
            tx_lines.append(
                (
                    f"- {transaction.transaction_id}: {transaction.transaction_type} for "
                    f"{transaction.amount:,.2f} {transaction.currency} on "
                    f"{transaction.timestamp.date().isoformat()}"
                )
            )

        risk_indicators = [
            f"- Risk level assessed as {case.risk_level.upper()}.",
            "- Activity pattern should be reviewed for structuring, layering, or unusual counterparty behavior.",
        ]

        if transactions and any(transaction.flags for transaction in transactions):
            risk_indicators.append("- Transaction flags suggest elevated scrutiny is warranted.")

        context_excerpt = compliance_context[0].strip() if compliance_context else "No compliance context retrieved."
        notes_block = analyst_notes.strip() if analyst_notes else "No analyst notes were provided."

        return (
            "Suspicious Activity Report\n\n"
            f"Subject: {case.subject_name}\n"
            f"Account: {case.subject_account}\n"
            f"Case Reference: {case.case_reference}\n\n"
            "Activity Summary:\n"
            f"{case.narrative_context or 'INSUFFICIENT_INFORMATION'}\n\n"
            "Transactional Evidence:\n"
            + ("\n".join(tx_lines) if tx_lines else "- No transactions available.\n")
            + "\n\nRisk Indicators:\n"
            + "\n".join(risk_indicators)
            + "\n\nCompliance Context:\n"
            + context_excerpt
            + "\n\nAnalyst Notes:\n"
            + notes_block
            + "\n\nFiling Recommendation:\n"
            "Continue human review and consider filing a SAR if the activity cannot be reasonably explained."
        )

    @staticmethod
    def _fallback_confidence(
        *,
        case: CaseModel,
        analyst_notes: str | None,
        compliance_context: list[str],
    ) -> float:
        base = {
            "high": 0.82,
            "medium": 0.68,
            "low": 0.56,
        }.get(case.risk_level.lower(), 0.62)
        if analyst_notes:
            base += 0.03
        if compliance_context:
            base += 0.02
        return min(round(base, 2), 0.9)
