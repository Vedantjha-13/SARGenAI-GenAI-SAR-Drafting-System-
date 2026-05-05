from __future__ import annotations

import asyncio
import logging
from pathlib import Path

from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

from backend.config import Settings

logger = logging.getLogger(__name__)


class RAGService:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._vector_store: FAISS | None = None

    async def initialize(self) -> None:
        if not self._settings.openai_api_key:
            logger.warning("OPENAI_API_KEY not configured. RAG retrieval will return empty context.")
            return

        index_dir = Path(self._settings.rag_index_dir)
        embeddings = OpenAIEmbeddings(
            model=self._settings.openai_embedding_model,
            api_key=self._settings.openai_api_key,
        )

        if index_dir.exists():
            logger.info("Loading existing FAISS index from %s", index_dir)
            self._vector_store = await asyncio.to_thread(
                FAISS.load_local,
                str(index_dir),
                embeddings,
                allow_dangerous_deserialization=True,
            )
            return

        logger.info("Building FAISS index from knowledge base")
        documents = self._build_documents()
        self._vector_store = await asyncio.to_thread(FAISS.from_documents, documents, embeddings)
        index_dir.mkdir(parents=True, exist_ok=True)
        await asyncio.to_thread(self._vector_store.save_local, str(index_dir))

    async def retrieve_context(self, query: str, k: int | None = None) -> list[str]:
        if self._vector_store is None:
            return []

        top_k = k if k is not None else self._settings.rag_top_k
        docs = await asyncio.to_thread(self._vector_store.similarity_search, query, top_k)
        return [doc.page_content for doc in docs]

    def _build_documents(self) -> list[Document]:
        knowledge_path = Path(self._settings.rag_knowledge_path)
        if knowledge_path.exists():
            raw_text = knowledge_path.read_text(encoding="utf-8")
            source = str(knowledge_path)
        else:
            raw_text = (
                "SARs must be factual and based only on observed transactional behavior.\n"
                "Do not infer criminal activity without evidence in case facts.\n"
                "Include transaction dates, amounts, counterparties, and reasons for suspicion.\n"
                "Use neutral language and flag unknown details explicitly.\n"
            )
            source = "embedded_default_rules"

        splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=120)
        chunks = splitter.split_text(raw_text)
        return [Document(page_content=chunk, metadata={"source": source}) for chunk in chunks]
