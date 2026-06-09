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

    auth_secret_key: str = "development-secret-key"
    auth_token_ttl_minutes: int = Field(default=60 * 24, ge=5, le=60 * 24 * 14)
    auth_exempt_paths: tuple[str, ...] = ("/health", "/auth/login")
    frontend_base_url: str = "http://localhost:5173"
    google_oauth_client_id: str | None = None
    google_oauth_client_secret: str | None = None
    github_oauth_client_id: str | None = None
    github_oauth_client_secret: str | None = None


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
