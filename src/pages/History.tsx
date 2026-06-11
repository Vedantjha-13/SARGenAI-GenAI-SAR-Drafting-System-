import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { ApiError, SarSummary, getSarHistory } from "../lib/api";

const statusTone: Record<string, string> = {
  pending: "border-primary/20 bg-primary/10 text-primary",
  approved: "border-tertiary/20 bg-tertiary/10 text-tertiary",
  rejected: "border-error/20 bg-error/10 text-error",
};

export default function History() {
  const [statusFilter, setStatusFilter] = useState("");
  const [reports, setReports] = useState<SarSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getSarHistory(statusFilter || undefined)
      .then((response) => setReports(response.items))
      .catch((requestError: ApiError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const summary = useMemo(() => {
    const total = reports.length;
    const approvedCount = reports.filter((report) => report.status.toLowerCase() === "approved").length;
    const pendingCount = reports.filter((report) => report.status.toLowerCase() === "pending").length;
    const averageConfidence = total === 0 ? 0 : (reports.reduce((sum, report) => sum + report.confidence_score, 0) / total) * 100;

    return { total, approvedCount, pendingCount, averageConfidence };
  }, [reports]);

  return (
    <AppShell
      heading="Suspicious Activity Ledger"
      subheading="Historical record of AI-assisted SAR generation, review, and compliance outcomes."
      topNav={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "Risk Monitor", to: "/risk-monitor" },
        { label: "Reports", to: "/history" },
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="glass-panel-strong rounded-[28px] p-8">
          <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-on-surface-variant">
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary">Audit-ready</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Backend history feed</span>
          </div>
          <h2 className="mt-5 max-w-3xl text-4xl font-black tracking-tight">
            Every SAR draft, approval, and rejection stays visible for the review team.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-on-surface-variant">
            Use the filters below to inspect the live Mongo-backed report ledger. The empty state now explains whether the backend has no data yet or the filter is too restrictive.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">Reports</p>
              <p className="mt-2 text-2xl font-black">{summary.total}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">Approved</p>
              <p className="mt-2 text-2xl font-black text-tertiary">{summary.approvedCount}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">Pending</p>
              <p className="mt-2 text-2xl font-black text-primary">{summary.pendingCount}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">Avg Confidence</p>
              <p className="mt-2 text-2xl font-black text-error">{summary.averageConfidence.toFixed(1)}%</p>
            </div>
          </div>
        </section>

        <aside className="glass-panel-strong rounded-[28px] p-8">
          <p className="text-[10px] uppercase tracking-[0.28em] text-primary">Query controls</p>
          <h3 className="mt-2 text-2xl font-bold">Scope the ledger</h3>
          <p className="mt-3 text-sm leading-7 text-on-surface-variant">
            The backend supports filtering by status. If the table is empty, it usually means the database only has the current seed set.
          </p>

          <label className="mt-6 block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">Status Filter</span>
            <select
              className="w-full rounded-2xl border border-white/10 bg-surface-container-high/80 px-4 py-3 text-sm outline-none transition focus:border-primary"
              onChange={(event) => setStatusFilter(event.target.value)}
              value={statusFilter}
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>

          <div className="mt-6 rounded-2xl border border-white/10 bg-surface-container/70 p-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">Data note</p>
            <p className="mt-3 text-sm leading-7 text-on-surface-variant">
              The frontend has a richer mock set, but the live database currently depends on the backend seed data. If you want a bigger persisted dataset, I can promote more cases into Mongo.
            </p>
          </div>
        </aside>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      ) : null}

      <div className="mt-6 glass-panel-strong overflow-hidden rounded-[28px]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-primary">Report stream</p>
            <h3 className="mt-1 text-xl font-bold">Historical SAR ledger</h3>
          </div>
          {loading ? <p className="text-sm text-on-surface-variant">Loading SAR history...</p> : null}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-white/5 text-xs uppercase tracking-widest text-on-surface-variant">
              <tr>
                <th className="px-6 py-4">SAR ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Confidence</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4">Approved By</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {reports.map((report) => (
                <tr key={report.id} className="border-t border-white/5 transition hover:bg-white/[0.03]">
                  <td className="px-6 py-4 font-semibold">{report.case_reference || report.id}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${statusTone[report.status.toLowerCase()] || "border-white/10 bg-white/5 text-on-surface-variant"}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">{(report.confidence_score * 100).toFixed(1)}%</td>
                  <td className="px-6 py-4 text-on-surface-variant">{new Date(report.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{report.approved_by || "Pending"}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary transition hover:bg-primary/15"
                      to={`/case/${report.case_id}`}
                    >
                      View Case
                    </Link>
                  </td>
                </tr>
              ))}
              {!loading && reports.length === 0 ? (
                <tr className="border-t border-white/5">
                  <td className="px-6 py-10 text-center text-sm text-on-surface-variant" colSpan={6}>
                    No SAR reports match the current filter. If the database is still empty, we need more seed data to populate the ledger.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
