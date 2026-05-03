export interface IntelligenceFeedItem {
  id: string;
  title: string;
  level: 'High Risk' | 'Medium Risk' | 'Information';
  detail: string;
  color: string;
  caseId: string;
}

export const intelligenceFeedItems: IntelligenceFeedItem[] = [
  {
    id: 'feed-structured-layering',
    title: 'Structured Layering Detected',
    level: 'High Risk',
    detail: 'AI identified a sequence of 14 micro-deposits across multiple nodes in Singapore.',
    color: 'text-error',
    caseId: 'CASE-002',
  },
  {
    id: 'feed-velocity-spike',
    title: 'Abnormal Velocity Spike',
    level: 'Medium Risk',
    detail: 'Entity exhibited a 400% increase in outgoing wire transfers versus baseline.',
    color: 'text-secondary',
    caseId: 'CASE-001',
  },
  {
    id: 'feed-kyc-mismatch',
    title: 'KYC Document Mismatch',
    level: 'Information',
    detail: 'Automated scan found discrepancy between registered address and recent activity.',
    color: 'text-tertiary',
    caseId: 'CASE-004',
  },
];
