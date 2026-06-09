import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CaseSummary, generateSar, getCases } from "../lib/api";

export default function SARReport() {
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialCaseId = searchParams.get("caseId") || "";
  const [selectedCaseId, setSelectedCaseId] = useState(initialCaseId);
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [casesLoading, setCasesLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    sar_id: string;
    confidence_score: number;
    ai_generated_text: string;
    retrieved_context_count: number;
    status: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    getCases()
      .then((data) => {
        if (!isMounted) {
          return;
        }
        setCases(data);
        if (!selectedCaseId && data.length > 0) {
          setSelectedCaseId(data[0].id);
        }
      })
      .catch((requestError: Error) => {
        if (isMounted) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setCasesLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initialCaseId]);

  const onGenerate = async () => {
    if (!selectedCaseId) {
      setError("Select a case before generating a SAR draft.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await generateSar(selectedCaseId, notes);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate SAR.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10 text-on-surface">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link className="text-sm text-primary" to="/dashboard">
          Back to Dashboard
        </Link>
        <div className="rounded-xl border border-white/10 bg-surface-container p-6">
          <h1 className="text-2xl font-bold">Generate SAR Report</h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Choose a case to draft a SAR narrative from live backend data.
          </p>

          <label className="mt-4 block">
            <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-on-surface-variant">Case</span>
            <select
              className="w-full rounded-lg border border-outline-variant bg-surface-container-high p-3 text-sm"
              disabled={casesLoading || loading || cases.length === 0}
              onChange={(event) => setSelectedCaseId(event.target.value)}
              value={selectedCaseId}
            >
              {cases.length === 0 ? <option value="">No cases available</option> : null}
              {cases.map((caseItem) => (
                <option key={caseItem.id} value={caseItem.id}>
                  {caseItem.case_reference} - {caseItem.subject_name}
                </option>
              ))}
            </select>
          </label>

          <textarea
            className="mt-4 w-full rounded-lg border border-outline-variant bg-surface-container-high p-3 text-sm"
            rows={5}
            placeholder="Optional analyst notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button
            className="mt-4 rounded-lg bg-gradient-to-br from-primary to-primary-container px-5 py-2 text-sm font-semibold text-on-primary"
            onClick={onGenerate}
            type="button"
            disabled={loading || casesLoading || !selectedCaseId}
          >
            {loading ? "Generating..." : "Generate SAR"}
          </button>
          {error ? <p className="mt-3 text-red-400">{error}</p> : null}
        </div>

        {result ? (
          <div className="rounded-xl border border-white/10 bg-surface-container p-6">
            <div className="mb-4 flex flex-wrap gap-4 text-sm">
              <span>SAR ID: {result.sar_id}</span>
              <span>Status: {result.status}</span>
              <span>Confidence: {(result.confidence_score * 100).toFixed(1)}%</span>
              <span>RAG Context: {result.retrieved_context_count}</span>
            </div>
            <pre className="whitespace-pre-wrap text-sm leading-7">{result.ai_generated_text}</pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}
