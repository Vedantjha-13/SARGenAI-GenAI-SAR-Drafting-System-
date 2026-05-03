import AppShell from '../components/layout/AppShell';

const workloads = [
  { caseId: 'Case #8821-X', title: 'Crypto-Exfiltration Chain', entity: 'Global Dynamics Corp', level: 'CRITICAL' },
  { caseId: 'Case #9104-B', title: 'Anomalous Trading Pattern', entity: 'Vertex Equity Holdings', level: 'MEDIUM' },
  { caseId: 'Case #7752-K', title: 'Multi-Jurisdiction SAR', entity: 'Sovereign Logistics Ltd', level: 'ROUTINE' },
];

export default function ProfileDashboard() {
  return (
    <AppShell
      heading="Operational Summary"
      subheading="Comprehensive performance metrics and case workload for Q4 operations."
      topNav={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Risk Monitor', to: '/risk-monitor' },
        { label: 'Reports', to: '/history' },
      ]}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-surface-container p-6 md:col-span-2">
              <p className="text-xs uppercase tracking-widest text-primary">Efficiency Rating</p>
              <p className="mt-3 text-5xl font-black">98.4%</p>
              <div className="mt-4 h-2 rounded-full bg-surface-variant">
                <div className="h-full w-[98.4%] rounded-full bg-gradient-to-r from-primary to-primary-container" />
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-surface-container p-6">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant">Reports Approved</p>
              <p className="mt-3 text-4xl font-black">142</p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-surface-container p-6">
            <h2 className="text-xl font-bold">Active Case Workload</h2>
            <div className="mt-4 space-y-3">
              {workloads.map((item) => (
                <div key={item.caseId} className="rounded-lg border border-white/5 bg-surface-container-high p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{item.caseId}: {item.title}</p>
                      <p className="text-sm text-on-surface-variant">Entity: {item.entity}</p>
                    </div>
                    <span className="rounded-full bg-surface-variant px-2 py-1 text-[10px] font-bold">{item.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-surface-container p-5">
            <h3 className="text-lg font-bold">Recent Activity</h3>
            <ul className="mt-3 space-y-3 text-sm text-on-surface-variant">
              <li>Drafted SAR report for Case #8821-X (12:04 PM)</li>
              <li>Risk level downgraded after manual review (09:45 AM)</li>
              <li>System sync completed with regional hub (Yesterday)</li>
            </ul>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/10 p-5">
            <p className="text-xs uppercase tracking-widest text-primary">Synthetic Insight</p>
            <p className="mt-2 text-sm text-on-surface">
              Based on current pace, Sovereign Logistics SAR can be completed in 22 minutes.
            </p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
