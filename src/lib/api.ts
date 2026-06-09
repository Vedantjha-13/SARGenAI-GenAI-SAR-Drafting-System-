export interface User {
  id: string;
  email: string;
  name: string;
  role: "analyst" | "supervisor" | "admin";
  oauth_provider: string;
  profile_picture?: string | null;
  last_login?: string | null;
}

export interface LoginPayload {
  email: string;
  name: string;
  role: User["role"];
  provider?: string;
  oauth_id?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

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

export interface SarSummary {
  id: string;
  case_id: string;
  case_reference?: string | null;
  status: string;
  confidence_score: number;
  created_by?: string | null;
  approved_by?: string | null;
  created_at: string;
  updated_at: string;
  approved_at?: string | null;
}

export interface PaginatedSarResponse {
  items: SarSummary[];
  total: number;
  limit: number;
  skip: number;
}

interface ApiErrorShape {
  error?: {
    code?: string;
    message?: string;
    status?: number;
  };
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
export const AUTH_STORAGE_KEY = "sar-auth-token";

export class ApiError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

function getStoredToken(): string | null {
  return window.localStorage.getItem(AUTH_STORAGE_KEY);
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers || {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getStoredToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    const rawText = await response.text();
    let json: ApiErrorShape | T | null = null;
    if (rawText) {
      try {
        json = JSON.parse(rawText) as ApiErrorShape | T;
      } catch {
        json = null;
      }
    }

    if (!response.ok) {
      const errorPayload = json as ApiErrorShape | null;
      throw new ApiError(
        errorPayload?.error?.message || `Request failed with status ${response.status}`,
        errorPayload?.error?.code,
        response.status,
      );
    }

    return (json ?? {}) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Request timed out.", "REQUEST_TIMEOUT");
    }
    throw new ApiError(error instanceof Error ? error.message : "Unexpected request failure.");
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser(): Promise<User> {
  return request<User>("/auth/me");
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

export function getSarHistory(status?: string): Promise<PaginatedSarResponse> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return request<PaginatedSarResponse>(`/sars/history${query}`);
}
