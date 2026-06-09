import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell";
import { ApiError, SarSummary, getSarHistory } from "../lib/api";

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

  const averageConfidence = useMemo(() => {
    if (reports.length === 0) {
      return 0;
    }
    const total = reports.reduce((sum, report) => sum + report.confidence_score, 0);
    return (total / reports.length) * 100;
  }, [reports]);

  const approvedCount = useMemo(
    () => reports.filter((report) => report.status.toLowerCase() === "approved").length,
    [reports],
  );

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
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-surface-container p-5">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant">Total Reports</p>
          <p className="mt-2 text-3xl font-black">{reports.length}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-surface-container p-5">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant">Average Confidence</p>
          <p className="mt-2 text-3xl font-black text-error">{averageConfidence.toFixed(1)}%</p>
        </div>
        <div className="rounded-xl border border-primary/20 bg-primary/10 p-5">
          <p className="text-xs uppercase tracking-widest text-primary">Approved Reports</p>
          <p className="mt-2 text-sm text-on-surface">{approvedCount} reports have cleared supervisor review in the current result set.</p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">Status Filter</p>
          <select
            className="mt-2 rounded-lg border border-white/10 bg-surface-container px-3 py-2 text-sm"
            onChange={(event) => setStatusFilter(event.target.value)}
            value={statusFilter}
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        {loading ? <p className="text-sm text-on-surface-variant">Loading SAR history...</p> : null}
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-error/25 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-white/10 bg-surface-container">
        <table className="w-full text-left">
          <thead className="bg-surface-container-high text-xs uppercase tracking-widest text-on-surface-variant">
            <tr>
              <th className="px-4 py-3">SAR ID</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Risk Score</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3">Approved By</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {reports.map((report) => (
              <tr key={report.id} className="border-t border-white/5">
                <td className="px-4 py-3 font-semibold">{report.case_reference || report.id}</td>
                <td className="px-4 py-3 capitalize">{report.status}</td>
                <td className="px-4 py-3">{(report.confidence_score * 100).toFixed(1)}</td>
                <td className="px-4 py-3">{new Date(report.created_at).toLocaleString()}</td>
                <td className="px-4 py-3">{report.approved_by || "Pending"}</td>
                <td className="px-4 py-3 text-right">
                  <button className="rounded-lg bg-primary/15 px-3 py-1 text-xs font-bold text-primary">View Report</button>
                </td>
              </tr>
            ))}
            {!loading && reports.length === 0 ? (
              <tr className="border-t border-white/5">
                <td className="px-4 py-6 text-center text-on-surface-variant" colSpan={6}>
                  No SAR reports match the current filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
