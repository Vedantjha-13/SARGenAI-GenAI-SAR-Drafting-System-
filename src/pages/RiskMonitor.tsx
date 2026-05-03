import AppShell from '../components/layout/AppShell';

const alerts = [
  {
    level: 'High Priority',
    title: 'Abnormal crypto-outflow detected from Segment-B3',
    detail: 'Potential laundering pattern identified across 12 unverified wallets in SEA region.',
    time: '2m ago',
  },
  {
    level: 'Medium Priority',
    title: "Shell entity 'Lumina Corp' linked to offshore registry",
    detail: '3 proxy directors previously flagged in the Pandora investigation.',
    time: '15m ago',
  },
  {
    level: 'Low Priority',
    title: 'Recurring wire sequence under reportable limit',
    detail: 'Structured deposits detected in San Jose division.',
    time: '1h ago',
  },
];

export default function RiskMonitor() {
  return (
    <AppShell
      heading="Risk Monitor"
      subheading="Global monitoring layer for live risk vectors and intelligence drift."
      topNav={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Risk Monitor', to: '/risk-monitor' },
        { label: 'Reports', to: '/history' },
      ]}
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="space-y-6 xl:col-span-2">
          <div className="rounded-xl border border-white/10 bg-surface-container p-6">
            <p className="text-xs uppercase tracking-widest text-primary">Live Hot Zones</p>
            <div className="mt-3 h-72 rounded-lg bg-gradient-to-br from-surface-variant to-surface-container-high" />
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 text-sm">
              <div className="rounded-lg bg-surface-container-high p-3"><p className="text-on-surface-variant">High Risk Nodes</p><p className="text-xl font-bold text-error">12</p></div>
              <div className="rounded-lg bg-surface-container-high p-3"><p className="text-on-surface-variant">Emerging Signals</p><p className="text-xl font-bold text-tertiary">142</p></div>
              <div className="rounded-lg bg-surface-container-high p-3"><p className="text-on-surface-variant">SAR Inbound</p><p className="text-xl font-bold text-primary">2,841</p></div>
              <div className="rounded-lg bg-surface-container-high p-3"><p className="text-on-surface-variant">Avg Volatility</p><p className="text-xl font-bold text-secondary">64%</p></div>
            </div>
          </div>
        </section>

        <aside className="rounded-xl border border-white/10 bg-surface-container overflow-hidden">
          <div className="border-b border-white/10 p-4">
            <h2 className="text-sm font-bold uppercase tracking-widest">Critical Alerts</h2>
          </div>
          <div className="space-y-0">
            {alerts.map((alert) => (
              <article key={alert.title} className="border-b border-white/5 p-4 last:border-b-0">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-error">{alert.level}</span>
                  <span className="text-[10px] text-on-surface-variant">{alert.time}</span>
                </div>
                <h3 className="text-sm font-semibold">{alert.title}</h3>
                <p className="mt-1 text-xs text-on-surface-variant">{alert.detail}</p>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
