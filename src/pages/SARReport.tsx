import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { mockCases, type SARCase } from '../data/mockData';
import { intelligenceFeedItems } from '../data/intelligenceFeedData';

type CaseSource = 'feed' | 'dataset';

function parseSource(value: string | null): CaseSource {
  return value === 'feed' ? 'feed' : 'dataset';
}

function formatDateLabel(value: string): string {
  const normalized = value.includes(' ') ? value.replace(' ', 'T') : value;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function getCaseVolume(caseData: SARCase): number {
  return caseData.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
}

function getConfidence(riskScore: number): number {
  return Math.max(68, Math.min(97, Math.round(60 + riskScore * 0.4)));
}

function getJurisdiction(caseData: SARCase): string {
  const highMonitoringKeywords = ['panama', 'singapore', 'dubai', 'hong kong', 'u.a.e', 'uae'];
  const firstHighRiskLocation = caseData.transactions.find((transaction) =>
    highMonitoringKeywords.some((keyword) => transaction.location.toLowerCase().includes(keyword)),
  );

  if (firstHighRiskLocation) {
    return `${firstHighRiskLocation.location} (High Monitoring)`;
  }

  return `${caseData.transactions[0]?.location ?? 'Global'} (Standard Monitoring)`;
}

function getDateWindow(caseData: SARCase): string {
  if (caseData.transactions.length === 0) {
    return 'No transactions on file';
  }

  const dates = caseData.transactions.map((transaction) => new Date(transaction.date));
  const validDates = dates.filter((date) => !Number.isNaN(date.getTime()));
  if (validDates.length === 0) {
    return 'Dates unavailable in dataset';
  }

  validDates.sort((a, b) => a.getTime() - b.getTime());
  const start = validDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const end = validDates[validDates.length - 1].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return `${start} to ${end}`;
}

function buildNarrative(caseData: SARCase, feedContext?: string): string[] {
  const suspiciousTransactions = caseData.transactions.filter((transaction) => transaction.suspicious);
  const averageSuspiciousAmount =
    suspiciousTransactions.length > 0
      ? Math.round(suspiciousTransactions.reduce((sum, transaction) => sum + transaction.amount, 0) / suspiciousTransactions.length)
      : 0;
  const transactionWindow = getDateWindow(caseData);

  return [
    `The subject, ${caseData.userName}, has exhibited behavior patterns requiring enhanced monitoring. During ${transactionWindow}, activity on account ${caseData.userId} diverged from expected ${caseData.accountType.toLowerCase()} behavior.`,
    suspiciousTransactions.length > 0
      ? `The dataset shows ${suspiciousTransactions.length} transactions marked suspicious, with an average flagged value of ${formatCurrency(averageSuspiciousAmount)}. This pattern aligns with known structuring and layering indicators.`
      : 'Although no single transaction was pre-flagged in the source dataset, aggregate velocity and transfer concentration warrant continued review.',
    feedContext
      ? `Intelligence feed context: ${feedContext} This signal increased report confidence and triggered automated SAR drafting.`
      : `Case description states: ${caseData.description}. Correlated profile review indicates risk score ${caseData.riskScore}/100, supporting SAR generation.`,
  ];
}

export default function SARReport() {
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const defaultSource = parseSource(searchParams.get('source'));
  const defaultFeedId = searchParams.get('feedId') ?? intelligenceFeedItems[0].id;
  const defaultCaseId = searchParams.get('caseId') ?? mockCases[0].id;

  const [source, setSource] = useState<CaseSource>(defaultSource);
  const [feedId, setFeedId] = useState(defaultFeedId);
  const [caseId, setCaseId] = useState(defaultCaseId);
  const [isGenerated, setIsGenerated] = useState(false);

  const selectedFeed = intelligenceFeedItems.find((item) => item.id === feedId) ?? intelligenceFeedItems[0];
  const feedCase = mockCases.find((item) => item.id === selectedFeed.caseId) ?? mockCases[0];
  const datasetCase = mockCases.find((item) => item.id === caseId) ?? mockCases[0];
  const selectedCase = source === 'feed' ? feedCase : datasetCase;

  const createdDate = formatDateLabel(selectedCase.createdAt);
  const confidence = getConfidence(selectedCase.riskScore);
  const totalEvents = selectedCase.transactions.length;
  const aggregateValue = getCaseVolume(selectedCase);
  const jurisdiction = getJurisdiction(selectedCase);
  const narrativeParagraphs = buildNarrative(selectedCase, source === 'feed' ? selectedFeed.detail : undefined);
  const reportId = `SENT-${selectedCase.id.replace('CASE-', '')}-${source === 'feed' ? 'F' : 'D'}`;

  const supportingEvidence = [
    ...(source === 'feed' ? [`Feed signal: ${selectedFeed.title} - ${selectedFeed.detail}`] : []),
    ...selectedCase.suspiciousPatterns,
  ].slice(0, 3);

  if (!isGenerated) {
    return (
      <div className="min-h-screen bg-background px-6 py-10 text-on-surface">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-surface-container p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Step 1: Case Detail Intake</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Generate SAR Report</h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Select where case details should come from. Once selected, the system will draft the SAR report using that data.
          </p>

          <div className="mt-8 space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-on-surface-variant">Case Detail Source</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <button
                className={`rounded-xl border p-4 text-left ${
                  source === 'feed' ? 'border-primary bg-primary/10' : 'border-outline-variant/40 bg-surface-container-low'
                }`}
                onClick={() => setSource('feed')}
                type="button"
              >
                <p className="text-sm font-bold">Intelligence Feed</p>
                <p className="mt-1 text-xs text-on-surface-variant">Use active feed signal and linked case details.</p>
              </button>
              <button
                className={`rounded-xl border p-4 text-left ${
                  source === 'dataset' ? 'border-primary bg-primary/10' : 'border-outline-variant/40 bg-surface-container-low'
                }`}
                onClick={() => setSource('dataset')}
                type="button"
              >
                <p className="text-sm font-bold">Case Dataset</p>
                <p className="mt-1 text-xs text-on-surface-variant">Select directly from the SAR dataset records.</p>
              </button>
            </div>
          </div>

          {source === 'feed' && (
            <div className="mt-6 space-y-3">
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-on-surface-variant" htmlFor="feed-select">
                Intelligence Feed Item
              </label>
              <select
                className="w-full rounded-lg border border-outline-variant bg-surface-container-high p-3 text-sm outline-none focus:border-primary"
                id="feed-select"
                onChange={(event) => setFeedId(event.target.value)}
                value={feedId}
              >
                {intelligenceFeedItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({item.level})
                  </option>
                ))}
              </select>
              <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">Linked Case Detail</p>
                <p className="mt-2 text-sm">
                  {feedCase.id} - {feedCase.userName}
                </p>
                <p className="mt-1 text-xs text-on-surface-variant">{selectedFeed.detail}</p>
              </div>
            </div>
          )}

          {source === 'dataset' && (
            <div className="mt-6 space-y-3">
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-on-surface-variant" htmlFor="case-select">
                Dataset Case
              </label>
              <select
                className="w-full rounded-lg border border-outline-variant bg-surface-container-high p-3 text-sm outline-none focus:border-primary"
                id="case-select"
                onChange={(event) => setCaseId(event.target.value)}
                value={caseId}
              >
                {mockCases.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id} - {item.userName} (Risk {item.riskScore})
                  </option>
                ))}
              </select>
              <div className="rounded-xl border border-outline-variant/40 bg-surface-container-low p-4">
                <p className="text-sm font-semibold">{datasetCase.userName}</p>
                <p className="mt-1 text-xs text-on-surface-variant">{datasetCase.description}</p>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Link className="text-sm text-on-surface-variant transition-colors hover:text-on-surface" to="/dashboard">
              Cancel and return to dashboard
            </Link>
            <button
              className="rounded-lg bg-gradient-to-br from-primary to-primary-container px-6 py-3 text-xs font-bold uppercase tracking-widest text-on-primary"
              onClick={() => setIsGenerated(true)}
              type="button"
            >
              Make SAR Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary selection:text-on-primary">
      <nav className="fixed top-0 z-50 flex h-16 w-full max-w-full items-center justify-between border-b border-white/10 bg-[#10131a] px-8">
        <div className="text-xl font-bold tracking-tighter text-[#98cbff]">Synthetic Intelligence Ledger</div>
        <div className="hidden items-center gap-8 md:flex">
          <Link className="text-[#b7c8e1] transition-colors hover:text-[#98cbff]" to="/intelligence-feed">
            Intelligence
          </Link>
          <span className="border-b-2 border-[#98cbff] pb-1 text-[#98cbff]">Ledger</span>
          <Link className="text-[#b7c8e1] transition-colors hover:text-[#98cbff]" to="/history">
            Archive
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined cursor-pointer rounded-full p-2 text-[#b7c8e1] transition-all duration-300 hover:bg-white/5">
            notifications
          </span>
          <span className="material-symbols-outlined cursor-pointer rounded-full p-2 text-[#b7c8e1] transition-all duration-300 hover:bg-white/5">
            settings
          </span>
          <button
            className="rounded-full border border-outline-variant px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-on-surface-variant"
            onClick={() => setIsGenerated(false)}
            type="button"
          >
            New Input
          </button>
        </div>
      </nav>

      <main className="flex flex-col items-center px-6 pb-24 pt-32 md:px-0">
        <div className="w-full max-w-4xl space-y-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="space-y-1">
              <Link className="group mb-4 flex items-center gap-2 text-primary transition-colors hover:text-primary-fixed-dim" to="/dashboard">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span className="text-xs font-bold uppercase tracking-[0.1em]">Back to Dashboard</span>
              </Link>
              <h1 className="text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">Suspicious Activity Report</h1>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <span className="font-mono tracking-wider text-secondary">SAR ID: {reportId}</span>
                <span className="h-1 w-1 rounded-full bg-outline-variant" />
                <div className="flex items-center gap-2 rounded-full bg-tertiary/10 px-3 py-1 text-xs font-bold tracking-wide text-tertiary">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  Generated
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-primary to-primary-container px-5 py-2.5 font-semibold text-on-primary transition-all duration-200 hover:shadow-[0_0_20px_rgba(152,203,255,0.3)] active:scale-95"
                type="button"
              >
                <span className="material-symbols-outlined text-xl">download</span>
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1 overflow-hidden rounded-xl border border-white/5 bg-surface-container-low px-1 md:grid-cols-3">
            <div className="space-y-1 bg-surface p-6">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Created Date</p>
              <p className="text-lg font-medium">{createdDate}</p>
            </div>
            <div className="space-y-1 bg-surface p-6">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Case Source</p>
              <p className="text-lg font-medium">{source === 'feed' ? 'Intelligence Feed' : 'Dataset Record'}</p>
            </div>
            <div className="space-y-1 bg-surface p-6">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Intelligence Score</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-primary">{confidence}% Confidence</p>
                <span className="text-xs text-on-surface-variant">{source === 'feed' ? 'Model v3.1' : 'Model v3.0'}</span>
              </div>
            </div>
          </div>

          <div className="relative space-y-16 rounded-xl border border-white/5 bg-surface-container-low p-8 md:p-12">
            <div className="pointer-events-none absolute right-12 top-12 select-none opacity-[0.03]">
              <span className="material-symbols-outlined text-[12rem]">security</span>
            </div>

            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-outline-variant/30" />
                <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-primary">01. Subject Information</h2>
                <div className="h-px flex-1 bg-outline-variant/30" />
              </div>
              <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Primary Entity Name</label>
                  <p className="text-2xl font-semibold">{selectedCase.userName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Account Identifier</label>
                  <p className="text-2xl font-mono text-secondary">{selectedCase.userId}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Entity Type</label>
                  <p className="text-lg">{selectedCase.accountType}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Jurisdiction</label>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-secondary">public</span>
                    <p className="text-lg">{jurisdiction}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-outline-variant/30" />
                <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-primary">02. Transaction Summary</h2>
                <div className="h-px flex-1 bg-outline-variant/30" />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex aspect-video flex-col justify-between rounded-lg border border-white/5 bg-surface-container p-6 md:aspect-square">
                  <span className="material-symbols-outlined text-3xl text-secondary">swap_horiz</span>
                  <div>
                    <p className="text-4xl font-bold tracking-tight">{totalEvents}</p>
                    <p className="text-sm font-medium text-on-surface-variant">Total Events</p>
                  </div>
                </div>
                <div className="flex aspect-video flex-col justify-between rounded-lg border border-white/5 bg-surface-container p-6 md:col-span-2 md:aspect-square">
                  <div className="flex items-start justify-between">
                    <span className="material-symbols-outlined text-3xl text-primary">payments</span>
                    <div className="text-right">
                      <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-primary-fixed-dim">Source Aggregation</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-5xl font-extrabold tracking-tighter text-on-surface">{formatCurrency(aggregateValue)}</p>
                    <p className="text-sm font-medium text-on-surface-variant">Aggregate Transaction Value</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-outline-variant/30" />
                <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-primary">03. Intelligence Narrative</h2>
                <div className="h-px flex-1 bg-outline-variant/30" />
              </div>
              <div className="rounded-lg border border-white/5 bg-surface-container p-8">
                <div className="editorial-line-height space-y-6 text-lg text-on-surface-variant">
                  {narrativeParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-outline-variant/30" />
                <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-primary">04. Supporting Evidence</h2>
                <div className="h-px flex-1 bg-outline-variant/30" />
              </div>
              <ul className="grid grid-cols-1 gap-4">
                {supportingEvidence.map((evidence, index) => (
                  <li
                    className={`flex items-start gap-4 rounded-lg border p-4 ${
                      index === 0 ? 'border-error/20 bg-error-container/20' : 'border-white/5 bg-surface'
                    }`}
                    key={evidence}
                  >
                    {index === 0 ? (
                      <span className="material-symbols-outlined shrink-0 text-xl text-error">warning</span>
                    ) : (
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                    <div className="space-y-1">
                      <p className={`font-semibold ${index === 0 ? 'text-error' : ''}`}>Evidence {index + 1}</p>
                      <p className="text-sm text-on-surface-variant">{evidence}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <footer className="flex flex-col items-center justify-between gap-6 border-t border-outline-variant/30 pt-12 md:flex-row">
              <div className="flex items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Digital Signature</span>
                  <span className="font-mono text-sm text-secondary">LEDGER_CERT_{selectedCase.id}_AUTH</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Last Edited</span>
                  <span className="text-sm">Generated by system</span>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-outline">Internal Document - Strict Confidentiality</p>
                <p className="text-[0.6875rem] text-outline-variant">&copy; 2023 Synthetic Intelligence Ledger. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </div>
      </main>

      <div className="glass-panel fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-6 rounded-full border border-white/10 px-6 py-3 shadow-2xl">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">GenAI Verified</span>
        </div>
        <div className="h-4 w-px bg-outline-variant" />
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-on-surface-variant transition-colors hover:text-primary" type="button">
            share
          </button>
          <button className="material-symbols-outlined text-on-surface-variant transition-colors hover:text-primary" type="button">
            print
          </button>
          <button className="material-symbols-outlined text-on-surface-variant transition-colors hover:text-primary" type="button">
            history
          </button>
        </div>
      </div>
    </div>
  );
}
