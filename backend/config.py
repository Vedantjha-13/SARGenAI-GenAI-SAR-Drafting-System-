from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "GenAI SAR Auto-Drafting Backend"
    api_prefix: str = ""
    log_level: str = "INFO"

    mongo_uri: str = "mongodb://localhost:27017"
    mongo_db_name: str = "sar_system"

    openai_api_key: str | None = None
    openai_model: str = "gpt-4.1-mini"
    openai_embedding_model: str = "text-embedding-3-large"

    rag_index_dir: str = "backend/.faiss_index"
    rag_knowledge_path: str = "backend/knowledge/compliance_rules.txt"
    rag_top_k: int = Field(default=4, ge=1, le=10)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()

