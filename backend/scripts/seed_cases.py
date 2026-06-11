from __future__ import annotations

import asyncio
from datetime import datetime, timedelta

from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = "mongodb+srv://vedantsharma13315_db_user:JAkqnwzNzohtcLpO@sarcluster.cygwnw0.mongodb.net/?appName=SARCluster"
DB_NAME = "SAR_system"


async def main() -> None:
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    cases = db["cases"]

    if await cases.count_documents({}) > 0:
        print("Cases already exist. Skipping seed.")
        client.close()
        return

    now = datetime.utcnow()
    seed_docs = [
        {
            "case_reference": "CASE-001",
            "subject_name": "Victor S. Kaelo",
            "subject_account": "SI-992384-VK",
            "risk_level": "high",
            "narrative_context": "Multiple shell entity flows across APAC and EMEA.",
            "transactions": [
                {
                    "transaction_id": "TX-00921-X",
                    "timestamp": now - timedelta(days=6),
                    "amount": 1450000.0,
                    "currency": "USD",
                    "transaction_type": "Wire Transfer",
                    "counterparty": "Meridian Offshore",
                    "location": "Panama",
                    "description": "Large cross-border wire",
                    "flags": ["high_value", "offshore"],
                },
                {
                    "transaction_id": "TX-00712-A",
                    "timestamp": now - timedelta(days=4),
                    "amount": 2900100.0,
                    "currency": "USD",
                    "transaction_type": "SWIFT / BTC",
                    "counterparty": "Crypto Exchange Node",
                    "location": "Singapore",
                    "description": "Rapid conversion to virtual asset",
                    "flags": ["layering", "crypto"],
                },
            ],
            "metadata": {"source": "seed"},
            "created_at": now - timedelta(days=10),
            "updated_at": now,
        },
        {
            "case_reference": "CASE-002",
            "subject_name": "Global Dynamics LLC",
            "subject_account": "GD-431552",
            "risk_level": "medium",
            "narrative_context": "Unusual velocity increase in ACH flows.",
            "transactions": [
                {
                    "transaction_id": "TX-02210-M",
                    "timestamp": now - timedelta(days=3),
                    "amount": 45200.0,
                    "currency": "USD",
                    "transaction_type": "ACH",
                    "counterparty": "Internal Credit",
                    "location": "New York",
                    "description": "Split credits near threshold",
                    "flags": ["structuring"],
                },
                {
                    "transaction_id": "TX-02215-Q",
                    "timestamp": now - timedelta(days=2),
                    "amount": 48900.0,
                    "currency": "USD",
                    "transaction_type": "ACH",
                    "counterparty": "Alpha Processing",
                    "location": "New York",
                    "description": "Repeated split transfers",
                    "flags": ["structuring", "velocity"],
                },
            ],
            "metadata": {"source": "seed"},
            "created_at": now - timedelta(days=8),
            "updated_at": now,
        },
    ]

    await cases.insert_many(seed_docs)
    print(f"Seeded {len(seed_docs)} cases.")
    client.close()


if __name__ == "__main__":
    asyncio.run(main())

