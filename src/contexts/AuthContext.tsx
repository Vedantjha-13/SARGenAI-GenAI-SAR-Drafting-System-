import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AUTH_STORAGE_KEY,
  ApiError,
  User,
  getCurrentUser,
  login as loginRequest,
  type LoginPayload,
} from "../lib/api";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
        setError(null);
      })
      .catch(() => {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      async login(payload) {
        setLoading(true);
        try {
          const response = await loginRequest(payload);
          window.localStorage.setItem(AUTH_STORAGE_KEY, response.access_token);
          setUser(response.user);
          setError(null);
        } catch (error) {
          const message = error instanceof ApiError ? error.message : "Login failed.";
          setError(message);
          throw error;
        } finally {
          setLoading(false);
        }
      },
      logout() {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        setUser(null);
        setError(null);
      },
    }),
    [error, loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
