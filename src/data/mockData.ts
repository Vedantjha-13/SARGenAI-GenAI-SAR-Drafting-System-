export interface Transaction {
  id: string;
  amount: number;
  date: string;
  location: string;
  type: string;
  suspicious?: boolean;
  description?: string;
}

export interface SARCase {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  accountType: string;
  riskScore: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  description: string;
  transactions: Transaction[];
  suspiciousPatterns: string[];
}

export interface SARReport {
  id: string;
  caseId: string;
  status: 'draft' | 'approved' | 'rejected';
  createdAt: string;
  approvedBy?: string;
  content: string;
  aiConfidence: number;
  version: number;
}

// Mock Cases Data
export const mockCases: SARCase[] = [
  {
    id: 'CASE-001',
    userId: 'USER-10234',
    userName: 'John Michael Anderson',
    userEmail: 'john.anderson@example.com',
    accountType: 'Premium Business',
    riskScore: 87,
    status: 'pending',
    createdAt: '2024-04-20 14:32:00',
    description: 'Large international transfers with no clear business purpose',
    transactions: [
      {
        id: 'TXN-001',
        amount: 150000,
        date: '2024-04-19',
        location: 'New York, USA',
        type: 'Wire Transfer',
        suspicious: true,
        description: 'International transfer to unknown beneficiary'
      },
      {
        id: 'TXN-002',
        amount: 89500,
        date: '2024-04-18',
        location: 'Dubai, UAE',
        type: 'Wire Transfer',
        suspicious: true,
        description: 'High-value transfer to high-risk jurisdiction'
      },
      {
        id: 'TXN-003',
        amount: 42300,
        date: '2024-04-17',
        location: 'Singapore',
        type: 'Wire Transfer',
        suspicious: false,
        description: 'Business payment to supplier'
      },
      {
        id: 'TXN-004',
        amount: 5600,
        date: '2024-04-16',
        location: 'London, UK',
        type: 'Card Payment',
        suspicious: false,
        description: 'Travel expenses'
      }
    ],
    suspiciousPatterns: [
      'Multiple high-value transfers to different jurisdictions within 48 hours',
      'Transfers to known high-risk jurisdictions',
      'No corresponding invoices or business documentation',
      'Unusual pattern for account type - previously dormant account'
    ]
  },
  {
    id: 'CASE-002',
    userId: 'USER-10456',
    userName: 'Sarah Elizabeth Thompson',
    userEmail: 'sarah.thompson@example.com',
    accountType: 'Standard Individual',
    riskScore: 65,
    status: 'pending',
    createdAt: '2024-04-21 09:15:00',
    description: 'Structured deposits below reporting threshold',
    transactions: [
      {
        id: 'TXN-101',
        amount: 9800,
        date: '2024-04-21',
        location: 'Los Angeles, USA',
        type: 'Deposit',
        suspicious: true,
        description: 'Cash deposit just below $10,000 threshold'
      },
      {
        id: 'TXN-102',
        amount: 9750,
        date: '2024-04-21',
        location: 'Los Angeles, USA',
        type: 'Deposit',
        suspicious: true,
        description: 'Multiple deposits same day'
      },
      {
        id: 'TXN-103',
        amount: 9900,
        date: '2024-04-20',
        location: 'Los Angeles, USA',
        type: 'Deposit',
        suspicious: true,
        description: 'Pattern of structured deposits'
      }
    ],
    suspiciousPatterns: [
      'Structuring - deposits just below reporting threshold',
      'Multiple deposits on same day',
      'Pattern consistent with structuring scheme',
      'No legitimate business reason documented'
    ]
  },
  {
    id: 'CASE-003',
    userId: 'USER-10567',
    userName: 'Robert James Chen',
    userEmail: 'robert.chen@example.com',
    accountType: 'Premium Business',
    riskScore: 45,
    status: 'approved',
    createdAt: '2024-04-15 16:45:00',
    description: 'Review of recent transaction activity',
    transactions: [
      {
        id: 'TXN-201',
        amount: 75000,
        date: '2024-04-14',
        location: 'Hong Kong',
        type: 'Wire Transfer',
        suspicious: false,
        description: 'Regular supplier payment'
      },
      {
        id: 'TXN-202',
        amount: 120000,
        date: '2024-04-12',
        location: 'Shanghai, China',
        type: 'Wire Transfer',
        suspicious: false,
        description: 'Monthly inventory purchase'
      }
    ],
    suspiciousPatterns: [
      'Activity consistent with established business pattern',
      'Proper documentation provided for all transfers'
    ]
  },
  {
    id: 'CASE-004',
    userId: 'USER-10678',
    userName: 'Michelle Patricia Davis',
    userEmail: 'michelle.davis@example.com',
    accountType: 'Standard Individual',
    riskScore: 72,
    status: 'pending',
    createdAt: '2024-04-22 11:20:00',
    description: 'Unusual third-party transfers and rapid account turnover',
    transactions: [
      {
        id: 'TXN-301',
        amount: 250000,
        date: '2024-04-22',
        location: 'Miami, USA',
        type: 'Wire Transfer',
        suspicious: true,
        description: 'Large transfer to third party'
      },
      {
        id: 'TXN-302',
        amount: 180000,
        date: '2024-04-21',
        location: 'Panama',
        type: 'Wire Transfer',
        suspicious: true,
        description: 'High-risk jurisdiction transfer'
      }
    ],
    suspiciousPatterns: [
      'Large rapid movements of funds',
      'Transfers to high-risk jurisdictions',
      'Third-party beneficiaries',
      'Account opened recently - high activity unusual'
    ]
  },
  {
    id: 'CASE-005',
    userId: 'USER-10789',
    userName: 'David Michael Torres',
    userEmail: 'david.torres@example.com',
    accountType: 'Premium Business',
    riskScore: 32,
    status: 'rejected',
    createdAt: '2024-04-10 13:50:00',
    description: 'Initial review determined non-suspicious',
    transactions: [
      {
        id: 'TXN-401',
        amount: 45000,
        date: '2024-04-09',
        location: 'New York, USA',
        type: 'Wire Transfer',
        suspicious: false,
        description: 'Standard business transaction'
      }
    ],
    suspiciousPatterns: [
      'Activity consistent with normal business operations'
    ]
  }
];

// Mock SAR Reports History
export const mockSARReports: SARReport[] = [
  {
    id: 'SAR-2024-001',
    caseId: 'CASE-003',
    status: 'approved',
    createdAt: '2024-04-15 16:45:00',
    approvedBy: 'John Smith',
    content: `SUSPICIOUS ACTIVITY REPORT (SAR)

Financial Institution: Global Trust Bank
Report Filed Date: April 15, 2024

ACCOUNT INFORMATION:
Account Number: USER-10567
Account Holder: Robert James Chen
Account Type: Premium Business
Account Opening Date: January 2023

TRANSACTION SUMMARY:
On April 14, 2024, a wire transfer of $75,000.00 was sent to Hong Kong.
On April 12, 2024, a wire transfer of $120,000.00 was sent to Shanghai, China.

ANALYSIS:
The subject account shows consistent international transaction patterns aligned with documented business operations. All transfers include proper supporting documentation, including invoices from established suppliers. The frequency and amounts are consistent with historical account behavior for this business account type.

CONCLUSION:
Activity reviewed and determined to be consistent with legitimate business operations. Account holder has provided satisfactory documentation for all transfers. No further action required at this time.`,
    aiConfidence: 92,
    version: 1
  },
  {
    id: 'SAR-2024-002',
    caseId: 'CASE-005',
    status: 'rejected',
    createdAt: '2024-04-10 13:50:00',
    approvedBy: 'Maria Garcia',
    content: `SUSPICIOUS ACTIVITY REPORT (SAR)

Financial Institution: Global Trust Bank
Report Filed Date: April 10, 2024

INITIAL ASSESSMENT:
After preliminary review of account USER-10789, the transaction pattern does not meet the threshold for suspicious activity reporting.

RECOMMENDATION:
Recommend closure of this case without filing formal SAR.`,
    aiConfidence: 88,
    version: 1
  }
];

// Mock user profile
export const mockUserProfile = {
  name: 'James Wilson',
  email: 'james.wilson@globaltrust.com',
  role: 'Compliance Officer',
  department: 'AML Compliance',
  avatar: '👤'
};
