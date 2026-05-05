from __future__ import annotations

from datetime import datetime

from bson import ObjectId
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

from backend.config import Settings
from backend.db.connection import mongo_manager
from backend.models.case_model import CaseModel
from backend.models.sar_model import SARReportModel
from backend.services.rag_service import RAGService


class SARGenerationOutput(BaseModel):
    sar_draft: str = Field(min_length=80)
    confidence_score: float = Field(ge=0.0, le=1.0)
    rationale: str


class AIService:
    def __init__(self, settings: Settings, rag_service: RAGService) -> None:
        self._settings = settings
        self._rag_service = rag_service
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

    async def generate_sar(self, case: CaseModel, analyst_notes: str | None = None) -> SARReportModel:
        if not self._settings.openai_api_key:
            raise RuntimeError("OPENAI_API_KEY is not configured.")

        compliance_context = await self._rag_service.retrieve_context(
            query=f"{case.case_reference} {case.risk_level} AML suspicious activity"
        )
        compliance_text = "\n\n".join(compliance_context) if compliance_context else "No context retrieved."

        llm = ChatOpenAI(
            model=self._settings.openai_model,
            api_key=self._settings.openai_api_key,
            temperature=0,
        ).with_structured_output(SARGenerationOutput)

        chain = self._prompt | llm
        result = await chain.ainvoke(
            {
                "case_facts": self._format_case_facts(case),
                "compliance_context": compliance_text,
                "analyst_notes": analyst_notes or "None",
            }
        )

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
            },
            status="pending",
            created_at=now,
            updated_at=now,
        )

        inserted = await mongo_manager.sar_reports.insert_one(report.to_mongo())
        report.id = str(inserted.inserted_id)
        return report

    async def get_sar_by_id(self, sar_id: str) -> SARReportModel | None:
        if not ObjectId.is_valid(sar_id):
            return None
        document = await mongo_manager.sar_reports.find_one({"_id": ObjectId(sar_id)})
        if not document:
            return None
        return SARReportModel.from_mongo(document)

    async def update_sar(self, sar_id: str, human_edited_text: str) -> SARReportModel | None:
        if not ObjectId.is_valid(sar_id):
            return None

        now = datetime.utcnow()
        update = {
            "$set": {
                "human_edited_text": human_edited_text,
                "updated_at": now,
            }
        }
        await mongo_manager.sar_reports.update_one({"_id": ObjectId(sar_id)}, update)
        return await self.get_sar_by_id(sar_id)

    async def approve_sar(self, sar_id: str, approved_by: str | None = None) -> SARReportModel | None:
        if not ObjectId.is_valid(sar_id):
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
        return await self.get_sar_by_id(sar_id)

    async def reject_sar(
        self,
        sar_id: str,
        rejected_by: str | None = None,
        rejection_reason: str | None = None,
    ) -> SARReportModel | None:
        if not ObjectId.is_valid(sar_id):
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
        return await self.get_sar_by_id(sar_id)

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

