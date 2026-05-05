import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { CaseDetail as CaseDetailType, getCaseById } from "../lib/api";

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<CaseDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Missing case id.");
      setLoading(false);
      return;
    }
    getCaseById(id)
      .then(setCaseData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AppShell
      heading={caseData ? caseData.case_reference : "Case Detail"}
      subheading="Case Manager > Active Investigation"
      topNav={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Risk Monitor", to: "/risk-monitor" },
        { label: "Reports", to: "/history" },
      ]}
    >
      {loading ? <p>Loading case...</p> : null}
      {error ? <p className="text-red-400">Error: {error}</p> : null}

      {caseData ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-surface-container p-6">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant">Subject</p>
            <h2 className="mt-2 text-2xl font-bold">{caseData.subject_name}</h2>
            <p className="text-sm text-on-surface-variant">Account: {caseData.subject_account}</p>
            <p className="mt-2 text-sm text-on-surface-variant">Risk: {caseData.risk_level}</p>
            <p className="mt-3 text-sm">{caseData.narrative_context || "No narrative context provided."}</p>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/10 bg-surface-container">
            <table className="w-full text-left">
              <thead className="bg-surface-container-high text-xs uppercase tracking-widest text-on-surface-variant">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Transaction ID</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Flags</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {caseData.transactions.map((tx) => (
                  <tr key={tx.transaction_id} className="border-t border-white/5">
                    <td className="px-4 py-3">{new Date(tx.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3">{tx.transaction_id}</td>
                    <td className="px-4 py-3">{tx.amount.toLocaleString()} {tx.currency}</td>
                    <td className="px-4 py-3">{tx.transaction_type}</td>
                    <td className="px-4 py-3">{tx.flags.join(", ") || "none"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            className="rounded-xl bg-gradient-to-br from-primary to-primary-container px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-on-primary"
            onClick={() => navigate(`/sar-report?caseId=${caseData.id}`)}
            type="button"
          >
            Generate SAR Report
          </button>
        </div>
      ) : null}
    </AppShell>
  );
}

