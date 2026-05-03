import AppShell from '../components/layout/AppShell';

const reports = [
  ['SAR-2024-8812', 'Approved', '42.8', 'Oct 24, 2023', 'M. Vance'],
  ['SAR-2024-8809', 'Review Pending', '88.2', 'Oct 24, 2023', 'Pending'],
  ['SAR-2024-8794', 'Approved', '21.5', 'Oct 23, 2023', 'L. Chen'],
  ['SAR-2024-8791', 'Flagged', '95.1', 'Oct 23, 2023', 'J. Sterling'],
];

export default function History() {
  return (
    <AppShell
      heading="Suspicious Activity Ledger"
      subheading="Historical record of AI-assisted SAR generation, review, and compliance outcomes."
      topNav={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Risk Monitor', to: '/risk-monitor' },
        { label: 'Reports', to: '/history' },
      ]}
    >
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-surface-container p-5">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant">Total Reports</p>
          <p className="mt-2 text-3xl font-black">2,482</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-surface-container p-5">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant">Average Risk Score</p>
          <p className="mt-2 text-3xl font-black text-error">78.4</p>
        </div>
        <div className="rounded-xl border border-primary/20 bg-primary/10 p-5">
          <p className="text-xs uppercase tracking-widest text-primary">AI Intelligence</p>
          <p className="mt-2 text-sm text-on-surface">14 new anomalies flagged in the last hour for manual review.</p>
        </div>
      </div>

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
              <tr key={report[0]} className="border-t border-white/5">
                <td className="px-4 py-3 font-semibold">{report[0]}</td>
                <td className="px-4 py-3">{report[1]}</td>
                <td className="px-4 py-3">{report[2]}</td>
                <td className="px-4 py-3">{report[3]}</td>
                <td className="px-4 py-3">{report[4]}</td>
                <td className="px-4 py-3 text-right">
                  <button className="rounded-lg bg-primary/15 px-3 py-1 text-xs font-bold text-primary">View Report</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
