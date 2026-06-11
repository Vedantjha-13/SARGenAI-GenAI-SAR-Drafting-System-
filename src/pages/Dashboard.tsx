import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { CaseSummary, getCases } from "../lib/api";

const riskPalette: Record<string, string> = {
  low: "bg-tertiary/70",
  medium: "bg-primary/70",
  high: "bg-error/70",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getCases()
      .then((data) => {
        if (isMounted) {
          setCases(data);
        }
      })
      .catch((err: Error) => {
        if (isMounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const summary = useMemo(() => {
    const total = cases.length;
    const highRiskCount = cases.filter((item) => item.risk_level.toLowerCase() === "high").length;
    const mediumRiskCount = cases.filter((item) => item.risk_level.toLowerCase() === "medium").length;
    const totalTransactions = cases.reduce((sum, item) => sum + item.transaction_count, 0);
    const latestCase = cases[0] || null;
    const latestCaseShare = latestCase && totalTransactions > 0
      ? Math.min(100, Math.round((latestCase.transaction_count / totalTransactions) * 100))
      : 0;

    return {
      total,
      highRiskCount,
      mediumRiskCount,
      totalTransactions,
      latestCase,
      latestCaseShare,
    };
  }, [cases]);

  const riskBreakdown = useMemo(
    () => [
      { label: "High", value: summary.highRiskCount, tone: "bg-error" },
      { label: "Medium", value: summary.mediumRiskCount, tone: "bg-primary" },
      { label: "Low", value: Math.max(summary.total - summary.highRiskCount - summary.mediumRiskCount, 0), tone: "bg-tertiary" },
    ],
    [summary.highRiskCount, summary.mediumRiskCount, summary.total],
  );

  return (
    <AppShell
      heading="SAR Intelligence Overview"
      subheading="Live case feed, automated risk signals, and the latest human review activity."
      topNav={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Risk Monitor", to: "/risk-monitor" },
        { label: "Reports", to: "/history" },
      ]}
    >
      {loading ? (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-panel-strong min-h-[280px] animate-pulse rounded-[28px] p-8" />
          <div className="grid gap-6">
            <div className="glass-panel-strong min-h-[130px] animate-pulse rounded-[28px] p-6" />
            <div className="glass-panel-strong min-h-[130px] animate-pulse rounded-[28px] p-6" />
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      ) : null}

      {!loading ? (
        <>
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="glass-panel-strong relative overflow-hidden rounded-[28px] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
              <div className="absolute right-[-3rem] top-[-3rem] h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute bottom-[-4rem] left-[-4rem] h-56 w-56 rounded-full bg-tertiary/10 blur-3xl" />

              <div className="relative space-y-6">
                <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-on-surface-variant">
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary">Live backend data</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Analyst workspace</span>
                </div>

                <div className="max-w-3xl space-y-4">
                  <h2 className="text-4xl font-black tracking-tight md:text-5xl">
                    An AI-assisted case room built for fast review and accountable action.
                  </h2>
                  <p className="max-w-2xl text-sm leading-7 text-on-surface-variant">
                    This overview keeps the most recent cases, risk signals, and SAR generation actions in one place so analysts can move from triage to drafting without losing context.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">Active Cases</p>
                    <p className="mt-3 text-4xl font-black">{summary.total}</p>
                    <p className="mt-2 text-xs text-on-surface-variant">Pulled from MongoDB and ordered by update time.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">High Risk</p>
                    <p className="mt-3 text-4xl font-black text-error">{summary.highRiskCount}</p>
                    <p className="mt-2 text-xs text-on-surface-variant">Cases that should move to SAR drafting first.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">Transactions</p>
                    <p className="mt-3 text-4xl font-black text-primary">{summary.totalTransactions}</p>
                    <p className="mt-2 text-xs text-on-surface-variant">Evidence points available to the drafting engine.</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    className="rounded-full bg-gradient-to-r from-primary to-primary-container px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-on-primary"
                    to="/sar-report"
                  >
                    Draft New SAR
                  </Link>
                  {summary.latestCase ? (
                    <button
                      className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant transition hover:border-white/20 hover:text-on-surface"
                      onClick={() => navigate(`/case/${summary.latestCase?.id}`)}
                      type="button"
                    >
                      Open Latest Case
                    </button>
                  ) : null}
                </div>
              </div>
            </section>

            <aside className="grid gap-6">
              <div className="glass-panel-strong rounded-[28px] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-primary">Latest Signal</p>
                    <h3 className="mt-2 text-xl font-bold">Case {summary.latestCase?.case_reference || "n/a"}</h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                    {summary.latestCase?.risk_level || "idle"}
                  </span>
                </div>

                {summary.latestCase ? (
                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-surface-container/80 p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Subject</p>
                      <p className="mt-2 text-lg font-semibold">{summary.latestCase.subject_name}</p>
                      <p className="mt-1 text-xs text-on-surface-variant">{summary.latestCase.transaction_count} transactions in the current feed</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-surface-container/80 p-4">
                      <div className="flex items-center justify-between text-xs text-on-surface-variant">
                        <span>Review readiness</span>
                        <span>{summary.latestCaseShare}%</span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-container-high">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-tertiary" style={{ width: `${summary.latestCaseShare}%` }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mt-6 text-sm text-on-surface-variant">No cases were returned by the backend yet.</p>
                )}
              </div>

              <div className="glass-panel-strong rounded-[28px] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-primary">Risk Mix</p>
                    <h3 className="mt-2 text-xl font-bold">Portfolio breakdown</h3>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">Current result set</span>
                </div>

                <div className="mt-6 space-y-4">
                  {riskBreakdown.map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="text-on-surface-variant">{item.value}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
                        <div
                          className={`h-full rounded-full ${item.tone}`}
                          style={{ width: `${summary.total ? Math.max(10, (item.value / summary.total) * 100) : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          <div className="glass-panel-strong overflow-hidden rounded-[28px]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-primary">Case Queue</p>
                <h3 className="mt-1 text-xl font-bold">Most recent matters</h3>
              </div>
              <p className="text-sm text-on-surface-variant">
                {summary.total} cases loaded from the backend, sorted by last update.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-white/5 text-xs uppercase tracking-widest text-on-surface-variant">
                  <tr>
                    <th className="px-6 py-4">Case Ref</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Risk</th>
                    <th className="px-6 py-4">Tx Count</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((row) => {
                    const riskKey = row.risk_level.toLowerCase();
                    return (
                      <tr key={row.id} className="border-t border-white/5 text-sm transition hover:bg-white/[0.03]">
                        <td className="px-6 py-4 font-semibold">{row.case_reference}</td>
                        <td className="px-6 py-4 text-on-surface-variant">{row.subject_name}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white ${riskPalette[riskKey] || "bg-slate-600"}`}>
                            {row.risk_level}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-on-surface-variant">{row.transaction_count}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary transition hover:bg-primary/15"
                            onClick={() => navigate(`/case/${row.id}`)}
                            type="button"
                          >
                            View Case
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </AppShell>
  );
}
