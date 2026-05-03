import AppShell from '../components/layout/AppShell';
import { useNavigate } from 'react-router-dom';

const ledgerRows = [
  ['2023.10.27 14:22', 'TX-00921-X', 'Meridian Offshore', '$ 1,450,000.00', 'Wire Transfer', 'SUSPICIOUS'],
  ['2023.10.25 09:15', 'TX-00844-Z', 'Internal Credit', '$ 45,200.00', 'ACH', 'CLEARED'],
  ['2023.10.24 23:41', 'TX-00712-A', 'Crypto-Exchange Node', '$ 2,900,100.00', 'SWIFT / BTC', 'SUSPICIOUS'],
  ['2023.10.22 11:04', 'TX-00561-B', 'Local ATM - London', '$ 5,000.00', 'Cash Out', 'CLEARED'],
  ['2023.10.20 18:30', 'TX-00449-Y', 'Shell-Co Alpha-01', '$ 850,000.00', 'Structuring', 'SUSPICIOUS'],
];

export default function CaseDetail() {
  const navigate = useNavigate();

  return (
    <AppShell
      heading="Case 7741-Alpha"
      subheading="Case Manager > Active Investigation"
      topNav={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Risk Monitor', to: '/risk-monitor' },
        { label: 'Reports', to: '/history' },
      ]}
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold">Active Investigation</h2>
          <p className="text-xs text-on-surface-variant">Case Manager / Case 7741-Alpha</p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-lg bg-surface-container px-4 py-2 text-center">
            <p className="text-[10px] uppercase text-on-surface-variant">Current Risk</p>
            <p className="text-xl font-bold text-error">94/100</p>
          </div>
          <div className="rounded-lg bg-surface-container px-4 py-2 text-center">
            <p className="text-[10px] uppercase text-on-surface-variant">Flags Detected</p>
            <p className="text-xl font-bold text-tertiary">14</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 space-y-8 xl:col-span-8">
          <article className="rounded-xl border border-outline-variant/20 bg-surface-container p-6">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex gap-5">
                <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-surface-container-high to-surface-variant" />
                <div>
                  <h3 className="text-2xl font-bold">Victor S. Kaelo</h3>
                  <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                    <span className="rounded bg-primary px-2 py-1 font-bold text-on-primary">Tier 1 Subject</span>
                    <span className="rounded bg-surface-variant px-2 py-1 text-on-surface-variant">ID: SI-992384-VK</span>
                  </div>
                  <p className="mt-3 max-w-2xl text-sm text-on-surface-variant">
                    Primary beneficiary for Horizon Logistical Holdings. Multiple shell-entity affiliations detected across APAC and EMEA jurisdictions.
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
            </div>
            <div className="grid grid-cols-1 gap-4 border-t border-outline-variant/20 pt-5 md:grid-cols-3">
              <div><p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Affiliation</p><p className="text-sm">Horizon Holdings Ltd.</p></div>
              <div><p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Jurisdiction</p><p className="text-sm">Panama / Singapore</p></div>
              <div><p className="text-[10px] uppercase tracking-widest text-on-surface-variant">KYC Status</p><p className="text-sm text-error">Non-Compliant</p></div>
            </div>
          </article>

          <article className="overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container">
            <div className="flex items-center justify-between border-b border-outline-variant/20 px-6 py-4">
              <h4 className="text-sm font-bold uppercase tracking-widest">Transaction Ledger Activity</h4>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                <span className="material-symbols-outlined text-[18px]">download</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low text-[10px] uppercase tracking-widest text-on-surface-variant">
                  <tr>
                    <th className="px-6 py-3">Timestamp</th>
                    <th className="px-6 py-3">Transaction ID</th>
                    <th className="px-6 py-3">Entity Origin</th>
                    <th className="px-6 py-3">Amount (USD)</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {ledgerRows.map((row) => (
                    <tr key={row[1]} className="border-t border-outline-variant/10 hover:bg-surface-variant/20">
                      <td className="px-6 py-4 font-mono text-on-surface-variant">{row[0]}</td>
                      <td className="px-6 py-4 font-mono text-xs">{row[1]}</td>
                      <td className="px-6 py-4">{row[2]}</td>
                      <td className="px-6 py-4 font-semibold text-error">{row[3]}</td>
                      <td className="px-6 py-4">{row[4]}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${row[5] === 'SUSPICIOUS' ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary'}`}>
                          {row[5]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <aside className="col-span-12 space-y-6 xl:col-span-4">
          <div className="rounded-xl border border-primary/20 bg-surface-variant/20 p-6 backdrop-blur-xl">
            <h4 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              AI Intelligence Summary
            </h4>
            <p className="text-sm leading-relaxed text-on-surface">
              Subject Victor Kaelo has displayed recurring layering behavior across offshore entities and crypto exchanges.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-on-surface-variant">
              <li>Rapid flow through 4 intermediate jurisdictions in 72 hours.</li>
              <li>Dormant shell entity reactivation observed.</li>
              <li className="font-semibold text-error">Multiple smurfing attempts below mandatory threshold.</li>
            </ul>
            <div className="mt-5 border-t border-outline-variant/20 pt-4">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Risk Probability Score</p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-container-low">
                <div className="h-full w-[88%] bg-gradient-to-r from-primary to-error" />
              </div>
            </div>
          </div>

          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-container py-4 text-sm font-bold uppercase tracking-[0.1em] text-on-primary"
            onClick={() => navigate('/sar-report?source=dataset&caseId=CASE-001')}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">description</span>
            Generate SAR Report
          </button>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container py-4 text-sm font-bold uppercase tracking-[0.1em] text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">add_moderator</span>
            Flag For Senior Review
          </button>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-4">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Time Elapsed</p>
              <p className="mt-2 text-sm font-semibold">14 Days</p>
            </div>
            <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-4">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Collaborators</p>
              <p className="mt-2 text-sm font-semibold">4 Analysts</p>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
