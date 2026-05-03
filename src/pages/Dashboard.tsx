import AppShell from '../components/layout/AppShell';

const caseRows = [
  { id: '#SAR-90821-X', entity: 'Global Dynamics LLC', risk: 'Critical (9.4)', status: 'AI Synthesis Active' },
  { id: '#SAR-89110-B', entity: 'James Chen', risk: 'Moderate (6.1)', status: 'Manual Review' },
  { id: '#SAR-88921-A', entity: 'CloudScale Systems', risk: 'Low (2.4)', status: 'Resolved / Logged' },
  { id: '#SAR-88711-K', entity: 'Nexus Bancorp', risk: 'Critical (8.9)', status: 'Immediate Action Required' },
];

export default function Dashboard() {
  return (
    <AppShell
      heading="SAR Intelligence Overview"
      subheading="Real-time synthesis of risk vectors across global nodes."
      topNav={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Risk Monitor', to: '/risk-monitor' },
        { label: 'Reports', to: '/history' },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-surface-container p-6">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant">Total Active Cases</p>
          <p className="mt-2 text-4xl font-black">1,284</p>
          <p className="mt-2 text-xs text-tertiary">+12% from last log</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-surface-container p-6">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant">Pending AI Review</p>
          <p className="mt-2 text-4xl font-black">42</p>
          <p className="mt-2 text-xs text-on-surface-variant">8 critical threads detected</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-surface-container p-6">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant">Avg Risk Vector Score</p>
          <p className="mt-2 text-4xl font-black">7.8/10</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-variant">
            <div className="h-full w-[78%] bg-gradient-to-r from-primary to-error" />
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-surface-container">
        <table className="w-full text-left">
          <thead className="bg-surface-container-high">
            <tr className="text-xs uppercase tracking-widest text-on-surface-variant">
              <th className="px-4 py-3">Case ID</th>
              <th className="px-4 py-3">Entity</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {caseRows.map((row) => (
              <tr key={row.id} className="border-t border-white/5 text-sm">
                <td className="px-4 py-4 font-semibold">{row.id}</td>
                <td className="px-4 py-4">{row.entity}</td>
                <td className="px-4 py-4">{row.risk}</td>
                <td className="px-4 py-4">{row.status}</td>
                <td className="px-4 py-4 text-right">
                  <button className="rounded-lg bg-primary/15 px-3 py-1 text-xs font-bold text-primary hover:bg-primary/25">View Case</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
