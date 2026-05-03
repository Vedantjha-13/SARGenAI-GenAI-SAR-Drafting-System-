import AppShell from '../components/layout/AppShell';

export default function SystemSettings() {
  return (
    <AppShell
      heading="System Settings"
      subheading="Configure AI sensitivity, clearance models, and external integrations."
      topNav={[{ label: 'System Settings', to: '/system-settings' }]}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-white/10 bg-surface-container p-6">
            <h2 className="text-xl font-bold">AI Model Configuration</h2>
            <div className="mt-4 space-y-5">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Neural Sensitivity</span>
                  <span className="text-primary">84%</span>
                </div>
                <input className="w-full" type="range" defaultValue={84} max={100} />
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Hallucination Mitigation</span>
                  <span className="text-primary">Strict</span>
                </div>
                <input className="w-full" type="range" defaultValue={3} max={3} />
              </div>
              <div>
                <p className="mb-2 text-sm">Primary Engine Version</p>
                <select className="w-full rounded-lg border border-outline-variant bg-surface-container-high p-2 text-sm">
                  <option>Alpha-4 (Stable Deep Ledger)</option>
                  <option>Gamma-Prime (Experimental RAG)</option>
                  <option>Legacy v1.9 (Audit Only)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-surface-container p-6">
            <h3 className="text-lg font-bold">External Data Nexus Integrations</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-surface-container-high p-4">
                <p className="font-semibold">SWIFT Global</p>
                <p className="mt-1 text-xs text-tertiary">ACTIVE</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-surface-container-high p-4">
                <p className="font-semibold">LexisNexis</p>
                <p className="mt-1 text-xs text-secondary">IDLE</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-surface-container-high p-4">
                <p className="font-semibold">Refinitiv World-Check</p>
                <p className="mt-1 text-xs text-error">OFFLINE</p>
              </div>
            </div>
          </div>
        </section>

        <aside className="rounded-xl border border-white/10 bg-surface-container p-6">
          <h3 className="text-lg font-bold">Clearance Levels</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-lg bg-surface-container-high p-3">L5 Administrator (3)</div>
            <div className="rounded-lg bg-surface-container-high p-3">L3 Intelligence Officer (14)</div>
            <div className="rounded-lg bg-surface-container-high p-3">L1 Auditor (8)</div>
          </div>
          <button className="mt-5 w-full rounded-lg bg-primary py-2 text-xs font-bold text-on-primary">Modify Permissions</button>
        </aside>
      </div>
    </AppShell>
  );
}
