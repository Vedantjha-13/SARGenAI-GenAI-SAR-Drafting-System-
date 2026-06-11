from __future__ import annotations

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection, AsyncIOMotorDatabase

from config import Settings, get_settings


class MongoConnectionManager:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._client: AsyncIOMotorClient | None = None
        self._database: AsyncIOMotorDatabase | None = None

    async def connect(self) -> None:
        if self._client is not None:
            return

        self._client = AsyncIOMotorClient(self._settings.mongo_uri)
        self._database = self._client[self._settings.mongo_db_name]
        await self._client.admin.command("ping")
        from db.migrations import create_indexes

        await create_indexes()

    async def disconnect(self) -> None:
        if self._client is None:
            return
        self._client.close()
        self._client = None
        self._database = None

    @property
    def database(self) -> AsyncIOMotorDatabase:
        if self._database is None:
            raise RuntimeError("MongoDB is not connected.")
        return self._database

    @property
    def cases(self) -> AsyncIOMotorCollection:
        return self.database["cases"]

    @property
    def sar_reports(self) -> AsyncIOMotorCollection:
        return self.database["sar_reports"]

    @property
    def users(self) -> AsyncIOMotorCollection:
        return self.database["users"]

    @property
    def audit_logs(self) -> AsyncIOMotorCollection:
        return self.database["audit_logs"]


mongo_manager = MongoConnectionManager(get_settings())
