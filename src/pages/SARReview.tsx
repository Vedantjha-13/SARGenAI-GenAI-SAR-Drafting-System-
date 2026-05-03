import AppShell from '../components/layout/AppShell';

export default function SARReview() {
  return (
    <AppShell
      heading="Transaction Summary: Apex Global Holdings"
      subheading="High-priority review with AI narrative assistance."
      topNav={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Risk Monitor', to: '/risk-monitor' },
        { label: 'Reports', to: '/history' },
      ]}
    >
      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 space-y-6 lg:col-span-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-outline-variant/20 bg-surface-container p-5">
              <p className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">Total Volume (30D)</p>
              <p className="mt-2 text-2xl font-bold">$1,420,000.00</p>
            </div>
            <div className="rounded-xl border border-outline-variant/20 bg-surface-container p-5">
              <p className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">Risk Score</p>
              <p className="mt-2 text-2xl font-bold text-error">92/100</p>
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-6">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <span className="material-symbols-outlined text-[16px]">lightbulb</span>
              Key Suspicious Insights
            </h3>
            <ul className="mt-4 space-y-4 text-sm text-on-surface-variant">
              <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-error" />Rapid succession of 12 sub-threshold transfers ($9,500 each) over 48 hours.</li>
              <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-primary" />Beneficiary account was flagged in prior SAR filings for suspected layering.</li>
              <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-secondary" />Mismatch between declared business activity and digital asset liquidation patterns.</li>
            </ul>
          </div>

          <div className="overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container">
            <div className="h-44 bg-[linear-gradient(120deg,#1d2026,#32353c)]" />
            <div className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest">Flow Pattern Variance</p>
              <p className="text-xs text-on-surface-variant">Detected anomalies: 14</p>
            </div>
          </div>
        </section>

        <section className="col-span-12 flex min-h-[640px] flex-col overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container lg:col-span-7">
          <div className="flex items-center justify-between border-b border-outline-variant/20 p-6 bg-surface-container-high">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#1d2026" strokeWidth="4" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#98cbff" strokeDasharray="125.6" strokeDashoffset="22.6" strokeLinecap="round" strokeWidth="4" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary">82%</span>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest">AI Generated Draft</h3>
                <p className="text-xs text-on-surface-variant">Confidence level: high confidence narrative</p>
              </div>
            </div>
            <div className="flex gap-2 text-[10px] uppercase tracking-widest text-on-surface-variant">
              <span className="rounded bg-surface-variant px-2 py-1">V3.0 Model</span>
              <span className="rounded bg-surface-variant px-2 py-1">Draft #2</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-outline-variant/20 p-4">
            <div className="flex items-center gap-4 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] hover:text-primary">format_bold</span>
              <span className="material-symbols-outlined text-[18px] hover:text-primary">format_italic</span>
              <span className="material-symbols-outlined text-[18px] hover:text-primary">format_list_bulleted</span>
              <span className="material-symbols-outlined text-[18px] hover:text-primary">link</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Auto-suggesting...</p>
          </div>

          <div className="flex-1 p-8">
            <textarea
              className="h-full min-h-[380px] w-full resize-none rounded-lg border border-outline-variant bg-surface-container-high p-5 text-base leading-relaxed text-on-surface outline-none focus:border-primary"
              defaultValue={`Suspicious Activity Report: Narrative Section\n\nApex Global Holdings (the "Subject") has engaged in a series of transactions that lack apparent economic, business, or lawful purpose. Between June 14 and June 16, 2024, the Subject's primary checking account received a total of $114,000 via twelve separate wire transfers. Each transfer was intentionally kept below the $10,000 Currency Transaction Reporting threshold.\n\nFurther investigation into the originating entity, Omni-Node Solutions, reveals a lack of digital presence and an address associated with a commercial mail drop box. This pattern is consistent with structuring and layering behavior typically used to obfuscate the ultimate source of illicit funds.\n\nThe Subject attempted to move 85% of these funds into a known cryptocurrency exchange wallet within four hours of the final incoming wire, indicating high velocity movement designed to prevent institutional freezing of assets.`}
            />
          </div>

          <div className="flex items-center justify-between border-t border-outline-variant/20 bg-surface-container-low p-6">
            <button className="rounded-lg border border-outline-variant px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-white/5">Save Edit</button>
            <div className="flex gap-3">
              <button className="rounded-lg border border-error/30 bg-error/10 px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-error hover:bg-error/20">Reject</button>
              <button className="rounded-lg bg-gradient-to-br from-tertiary to-[#2fcf96] px-8 py-3 text-[11px] font-bold uppercase tracking-widest text-on-tertiary">Approve</button>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
