import AppShell from '../components/layout/AppShell';
import { useNavigate } from 'react-router-dom';
import { intelligenceFeedItems } from '../data/intelligenceFeedData';

export default function IntelligenceFeed() {
  const navigate = useNavigate();

  return (
    <AppShell
      heading="Intelligence Stream"
      subheading="Real-time surveillance monitoring active risk vectors."
      topNav={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Risk Monitor', to: '/risk-monitor' },
        { label: 'Reports', to: '/history' },
      ]}
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="space-y-4 xl:col-span-2">
          {intelligenceFeedItems.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/10 bg-surface-container p-5">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-bold">{item.title}</h2>
                <span className={`text-xs font-bold uppercase ${item.color}`}>{item.level}</span>
              </div>
              <p className="text-sm text-on-surface-variant">{item.detail}</p>
              <div className="mt-4 flex gap-2">
                <button
                  className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-on-primary"
                  onClick={() => navigate(`/sar-report?source=feed&feedId=${item.id}&caseId=${item.caseId}`)}
                  type="button"
                >
                  Draft SAR Report
                </button>
                <button className="rounded-lg border border-outline-variant px-3 py-2 text-xs font-bold text-on-surface-variant">Investigate</button>
              </div>
            </article>
          ))}
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-surface-container p-5">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant">Hot Zones Radar</p>
            <div className="mt-3 h-44 rounded-lg bg-gradient-to-br from-surface-variant to-surface-container-high" />
            <p className="mt-3 text-xs text-error">Southeast Asia sector: critical activity (8)</p>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/10 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Sentinel Assistant</p>
            <p className="mt-2 text-sm text-on-surface">
              Correlation between Singapore micro-deposits and Zenith Corp velocity shows 92% coordinated layering probability.
            </p>
            <button className="mt-4 w-full rounded-lg bg-primary/20 py-2 text-xs font-bold text-primary">Run Cross-Analysis</button>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
