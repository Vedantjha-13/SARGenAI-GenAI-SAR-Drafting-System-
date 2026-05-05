import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { CaseSummary, getCases } from "../lib/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getCases()
      .then((data) => {
        if (isMounted) setCases(data);
      })
      .catch((err: Error) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const highRiskCount = useMemo(
    () => cases.filter((c) => c.risk_level.toLowerCase() === "high").length,
    [cases],
  );
  const totalTransactions = useMemo(
    () => cases.reduce((sum, c) => sum + c.transaction_count, 0),
    [cases],
  );

  return (
    <AppShell
      heading="SAR Intelligence Overview"
      subheading="Live case feed from backend API."
      topNav={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Risk Monitor", to: "/risk-monitor" },
        { label: "Reports", to: "/history" },
      ]}
    >
      {loading ? <p>Loading cases...</p> : null}
      {error ? <p className="text-red-400">Error: {error}</p> : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-surface-container p-6">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant">Total Active Cases</p>
          <p className="mt-2 text-4xl font-black">{cases.length}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-surface-container p-6">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant">High Risk Cases</p>
          <p className="mt-2 text-4xl font-black">{highRiskCount}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-surface-container p-6">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant">Total Transactions</p>
          <p className="mt-2 text-4xl font-black">{totalTransactions}</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-surface-container">
        <table className="w-full text-left">
          <thead className="bg-surface-container-high">
            <tr className="text-xs uppercase tracking-widest text-on-surface-variant">
              <th className="px-4 py-3">Case Ref</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Tx Count</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((row) => (
              <tr key={row.id} className="border-t border-white/5 text-sm">
                <td className="px-4 py-4 font-semibold">{row.case_reference}</td>
                <td className="px-4 py-4">{row.subject_name}</td>
                <td className="px-4 py-4">{row.risk_level}</td>
                <td className="px-4 py-4">{row.transaction_count}</td>
                <td className="px-4 py-4 text-right">
                  <button
                    className="rounded-lg bg-primary/15 px-3 py-1 text-xs font-bold text-primary hover:bg-primary/25"
                    onClick={() => navigate(`/case/${row.id}`)}
                    type="button"
                  >
                    View Case
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}

