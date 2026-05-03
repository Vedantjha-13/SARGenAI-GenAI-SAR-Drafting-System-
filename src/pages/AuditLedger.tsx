import AppShell from '../components/layout/AppShell';

const auditRows = [
  ['2023-11-24T14:22:01.442Z', 'SAR Generated', 'SYNTH-AGENT-09', 'Success'],
  ['2023-11-24T14:21:55.012Z', 'User Login', 'vance.exec', 'Success'],
  ['2023-11-24T14:20:12.882Z', 'Threshold Updated', 'SYS-ADMIN-SEC', 'Failure'],
  ['2023-11-24T14:18:44.201Z', 'Data Refresh', 'CORE-ENGINE-B', 'Warning'],
  ['2023-11-24T14:15:30.112Z', 'Audit Signed', 'l.chen_compliance', 'Success'],
];

const heatmapHeights = ['h-8', 'h-12', 'h-20', 'h-10', 'h-24', 'h-14', 'h-6'];

export default function AuditLedger() {
  return (
    <AppShell
      heading="Immutable Activity Log"
      subheading="Full-spectrum investigative audit trail tracking AI-generated SAR actions and user events."
      topNav={[{ label: 'Audit Ledger', to: '/audit-ledger' }]}
    >
      <div className="overflow-hidden rounded-xl border border-white/10 bg-surface-container-low shadow-2xl">
        <table className="w-full text-left">
          <thead className="border-b border-white/10 bg-surface-container/50 text-[10px] uppercase tracking-widest text-on-surface-variant">
            <tr>
              <th className="px-6 py-4">Timestamp (ISO)</th>
              <th className="px-6 py-4">Event Type</th>
              <th className="px-6 py-4">User/System ID</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {auditRows.map((row) => (
              <tr key={`${row[0]}-${row[1]}`} className="hover:bg-white/[0.02]">
                <td className="px-6 py-4 font-mono text-primary-fixed-dim">{row[0]}</td>
                <td className="px-6 py-4">{row[1]}</td>
                <td className="px-6 py-4">{row[2]}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    row[3] === 'Success'
                      ? 'bg-tertiary/10 text-tertiary'
                      : row[3] === 'Failure'
                      ? 'bg-error/10 text-error'
                      : 'bg-secondary/10 text-secondary'
                  }`}>
                    {row[3]}
                  </span>
                </td>
                <td className="px-6 py-4 text-primary"><span className="material-symbols-outlined">chevron_right</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-surface-container-low p-6">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Activity Heatmap</h3>
          <div className="mt-5 flex h-24 items-end gap-1">
            {heatmapHeights.map((height, idx) => (
              <div key={idx} className={`flex-1 rounded-t bg-surface-container transition-colors hover:bg-primary/40 ${height} ${idx === 4 ? 'bg-primary' : ''} ${idx === 2 ? 'bg-primary/40' : ''}`} />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[10px] font-bold text-on-surface-variant"><span>08:00</span><span>12:00</span><span>16:00</span></div>
        </div>

        <div className="rounded-xl border border-white/10 bg-surface-container-low p-6">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">System Latency</h3>
          <div className="mt-4 flex items-center gap-4">
            <p className="text-4xl font-black text-tertiary">14<span className="ml-1 text-sm">ms</span></p>
            <div className="flex-1">
              <div className="h-1.5 w-full rounded-full bg-surface-container overflow-hidden">
                <div className="h-full w-[14%] bg-tertiary" />
              </div>
              <p className="mt-2 text-[10px] text-on-surface-variant">Optimal Performance Range</p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-[11px]">
            <div className="flex justify-between"><span className="text-on-surface-variant">Uptime</span><span className="font-bold">99.998%</span></div>
            <div className="flex justify-between"><span className="text-on-surface-variant">Failed Logs</span><span className="font-bold text-error">0.02%</span></div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-surface-container-low p-6">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Recent Anomalies</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-error" />
              <div>
                <p className="text-xs font-bold">Unusual Admin Login</p>
                <p className="text-[10px] text-on-surface-variant">Origin: IP 192.168.1.105 (Remote)</p>
              </div>
              <span className="ml-auto text-[10px] text-on-surface-variant">2m ago</span>
            </div>
            <div className="flex items-start gap-3 opacity-70">
              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary" />
              <div>
                <p className="text-xs font-bold">Rate Limit Warning</p>
                <p className="text-[10px] text-on-surface-variant">External API Gateway Sector 4</p>
              </div>
              <span className="ml-auto text-[10px] text-on-surface-variant">1h ago</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
