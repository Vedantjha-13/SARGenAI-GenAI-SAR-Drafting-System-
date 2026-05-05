export interface CaseSummary {
  id: string;
  case_reference: string;
  subject_name: string;
  risk_level: string;
  transaction_count: number;
  updated_at: string;
}

export interface Transaction {
  transaction_id: string;
  timestamp: string;
  amount: number;
  currency: string;
  transaction_type: string;
  counterparty?: string | null;
  location?: string | null;
  description?: string | null;
  flags: string[];
}

export interface CaseDetail {
  id: string;
  case_reference: string;
  subject_name: string;
  subject_account: string;
  risk_level: string;
  narrative_context?: string | null;
  transactions: Transaction[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface GenerateSarResponse {
  sar_id: string;
  case_id: string;
  status: string;
  ai_generated_text: string;
  confidence_score: number;
  retrieved_context_count: number;
  created_at: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Mock data fallback
const mockCases: CaseSummary[] = [
  {
    id: "case-001",
    case_reference: "SAR-2024-001",
    subject_name: "John Smith",
    risk_level: "high",
    transaction_count: 12,
    updated_at: "2024-01-15T10:30:00Z"
  },
  {
    id: "case-002",
    case_reference: "SAR-2024-002",
    subject_name: "Jane Doe",
    risk_level: "medium",
    transaction_count: 8,
    updated_at: "2024-01-14T14:20:00Z"
  },
  {
    id: "case-003",
    case_reference: "SAR-2024-003",
    subject_name: "Robert Wilson",
    risk_level: "high",
    transaction_count: 15,
    updated_at: "2024-01-13T09:15:00Z"
  },
  {
    id: "case-004",
    case_reference: "SAR-2024-004",
    subject_name: "Maria Garcia",
    risk_level: "low",
    transaction_count: 5,
    updated_at: "2024-01-12T11:45:00Z"
  },
  {
    id: "case-005",
    case_reference: "SAR-2024-005",
    subject_name: "Ahmed Hassan",
    risk_level: "medium",
    transaction_count: 20,
    updated_at: "2024-01-11T16:00:00Z"
  }
];

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    // Fallback to mock data if backend is unavailable
    console.warn("Backend unavailable, using mock data:", error);
    if (path === "/cases") {
      return Promise.resolve(mockCases as T);
    }
    throw error;
  }
}

export function getCases(): Promise<CaseSummary[]> {
  return request<CaseSummary[]>("/cases");
}

export function getCaseById(caseId: string): Promise<CaseDetail> {
  return request<CaseDetail>(`/case/${caseId}`);
}

export function generateSar(caseId: string, analystNotes?: string): Promise<GenerateSarResponse> {
  return request<GenerateSarResponse>("/generate-sar", {
    method: "POST",
    body: JSON.stringify({ case_id: caseId, analyst_notes: analystNotes || null }),
  });
}

