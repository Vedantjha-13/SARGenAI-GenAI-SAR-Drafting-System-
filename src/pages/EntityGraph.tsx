import AppShell from '../components/layout/AppShell';

export default function EntityGraph() {
  return (
    <AppShell
      heading="Live Entity Topology"
      subheading="Graph intelligence for connected entities and laundering pathways."
      topNav={[
        { label: 'Live Topology', to: '/entity-graph' },
        { label: 'Historical Logs', to: '/audit-ledger' },
      ]}
    >
      <div className="relative h-[calc(100vh-180px)] min-h-[620px] overflow-hidden rounded-xl border border-white/10 bg-surface-container-lowest canvas-grid">
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          <line x1="45%" y1="40%" x2="55%" y2="55%" stroke="#ffb4ab" strokeWidth="2" strokeDasharray="8 4" opacity="0.7" />
          <line x1="55%" y1="55%" x2="65%" y2="42%" stroke="#4edea3" strokeWidth="1.5" opacity="0.6" />
          <line x1="55%" y1="55%" x2="52%" y2="75%" stroke="#ffb4ab" strokeWidth="3" opacity="0.8" />
          <line x1="30%" y1="45%" x2="45%" y2="40%" stroke="#b7c8e1" strokeWidth="1" opacity="0.5" />
          <line x1="75%" y1="50%" x2="65%" y2="42%" stroke="#b7c8e1" strokeWidth="1" opacity="0.5" />
        </svg>

        <div className="absolute left-[55%] top-[55%] -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-primary/20 blur-xl" />
            <div className="relative flex h-24 w-24 flex-col items-center justify-center rounded-xl border-2 border-primary bg-surface-container p-2 text-center shadow-2xl">
              <span className="material-symbols-outlined text-primary">person</span>
              <p className="text-[10px] font-bold leading-tight">KYC-9921<br />ALEXEI VOLKOV</p>
            </div>
          </div>
        </div>

        <div className="absolute left-[45%] top-[40%] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-error bg-surface-container p-3 text-center">
          <span className="material-symbols-outlined text-error">corporate_fare</span>
          <p className="text-[9px] font-bold uppercase">Volkov Holdings</p>
          <p className="mt-1 rounded-full bg-error-container px-2 py-0.5 text-[8px] font-bold text-on-error-container">HIGH RISK</p>
        </div>

        <div className="absolute left-[65%] top-[42%] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-tertiary bg-surface-container p-3 text-center">
          <span className="material-symbols-outlined text-tertiary">domain</span>
          <p className="text-[9px] font-bold uppercase">Cyprus Alpha LT</p>
          <p className="mt-1 rounded-full bg-tertiary px-2 py-0.5 text-[8px] font-bold text-on-tertiary">VERIFIED</p>
        </div>

        <div className="absolute left-[52%] top-[75%] -translate-x-1/2 -translate-y-1/2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant bg-surface-container-highest">
            <span className="material-symbols-outlined text-slate-400">payments</span>
          </div>
          <div className="mt-2 rounded bg-surface-container-high px-2 py-1 text-[9px]">$12.4M Contagion</div>
        </div>

        <aside className="absolute bottom-6 right-6 top-6 w-80 overflow-hidden rounded-xl border border-white/10 bg-surface-container/75 backdrop-blur-xl">
          <div className="border-b border-white/10 p-5">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Entity Profile</p>
                <h2 className="text-xl font-bold">Alexei Volkov</h2>
              </div>
              <span className="rounded bg-error-container px-2 py-1 text-[10px] font-bold uppercase text-on-error-container">Flagged</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded bg-surface-container-low p-3">
                <p className="text-[9px] uppercase text-on-surface-variant">Exposure</p>
                <p className="text-lg font-bold">$12.4M</p>
              </div>
              <div className="rounded bg-surface-container-low p-3">
                <p className="text-[9px] uppercase text-on-surface-variant">Risk Score</p>
                <p className="text-lg font-bold text-error">8.9/10</p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5 text-xs">
            <section>
              <h3 className="mb-2 flex items-center gap-2 font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-primary">psychology</span>
                Intelligence Insight
              </h3>
              <div className="rounded border-l-2 border-primary bg-surface-container-high p-3 text-on-surface-variant">
                Multi-hop contagion detected across 4 shell entities in Panama. Significant liquidity flow identified toward high-risk jurisdictions.
              </div>
            </section>

            <section>
              <p className="mb-2 font-bold uppercase tracking-wider text-on-surface-variant">Network Composition</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded bg-surface-container-low p-2"><span>Sanctioned Affiliates</span><span>02</span></div>
                <div className="flex items-center justify-between rounded bg-surface-container-low p-2"><span>Offshore Shelves</span><span>14</span></div>
                <div className="flex items-center justify-between rounded bg-surface-container-low p-2"><span>Verified Tier-1s</span><span>05</span></div>
              </div>
            </section>

            <section className="rounded border border-white/10 bg-surface-variant/30 p-3 italic text-on-surface-variant">
              "Initial findings suggest structured laundering through nested accounts. Recommend immediate manual audit of the Volkov-Panama pipeline."
            </section>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
