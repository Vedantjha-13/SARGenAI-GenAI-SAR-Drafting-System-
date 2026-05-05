# GenAI SAR Auto-Drafting Backend

Production-oriented FastAPI backend for suspicious activity report drafting with:
- Async MongoDB persistence (`cases`, `sar_reports`)
- LLM-based SAR generation (OpenAI)
- LangChain + FAISS retrieval-augmented prompting
- Human-in-the-loop SAR updates and decisions

## Run

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app:app --reload --port 8000
```

## API Endpoints

- `GET /health`
- `GET /cases`
- `GET /case/{id}`
- `POST /generate-sar`
- `POST /update-sar`
- `POST /approve-sar`
- `POST /reject-sar`
- `GET /sar/{id}`

## Expected Mongo Collections

- `cases`
- `sar_reports`

