import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-on-surface">
        <p className="text-sm uppercase tracking-[0.2em] text-on-surface-variant">Validating secure session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />;
  }

  return <Outlet />;
}
