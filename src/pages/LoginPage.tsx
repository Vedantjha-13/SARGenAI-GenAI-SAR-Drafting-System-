import { FormEvent, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { User } from "../lib/api";

const roles: User["role"][] = ["analyst", "supervisor", "admin"];

export default function LoginPage() {
  const { user, login, loading, error } = useAuth();
  const location = useLocation();
  const redirectTarget = (location.state as { from?: string } | null)?.from || "/dashboard";
  const [email, setEmail] = useState("analyst@sar.local");
  const [name, setName] = useState("AML Analyst");
  const [role, setRole] = useState<User["role"]>("analyst");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (user) {
    return <Navigate replace to={redirectTarget} />;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await login({
        email,
        name,
        role,
        provider: "local",
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#17304a_0%,#0c1017_42%,#06080d_100%)] px-6 py-16 text-on-surface">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[28px] border border-white/10 bg-black/20 p-10 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Secure Access</p>
          <h1 className="mt-4 max-w-xl text-5xl font-black leading-tight">
            Human-in-the-loop SAR drafting with accountable approvals.
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-7 text-on-surface-variant">
            This build now requires an authenticated session before analysts can view cases, generate SARs, or review history.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">Audit Trail</p>
              <p className="mt-3 text-sm">Approvals, edits, rejections, and archives are captured with actor metadata.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">RBAC</p>
              <p className="mt-3 text-sm">Analysts draft, supervisors approve, and admins retain broad oversight.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">History</p>
              <p className="mt-3 text-sm">The report ledger now reads live SAR data from the backend instead of placeholder rows.</p>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-primary/20 bg-slate-950/80 p-8 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Session Bootstrap</p>
          <h2 className="mt-3 text-2xl font-bold">Sign in to continue</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            This local flow issues a signed application token against the backend user store.
          </p>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">Full Name</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-primary"
                onChange={(event) => setName(event.target.value)}
                value={name}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">Work Email</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-primary"
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                value={email}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-on-surface-variant">Role</span>
              <select
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-primary"
                onChange={(event) => setRole(event.target.value as User["role"])}
                value={role}
              >
                {roles.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            {formError || error ? (
              <p className="rounded-2xl border border-error/25 bg-error/10 px-4 py-3 text-sm text-error">
                {formError || error}
              </p>
            ) : null}

            <button
              className="w-full rounded-2xl bg-gradient-to-r from-primary to-primary-container px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting || loading}
              type="submit"
            >
              {submitting || loading ? "Signing in..." : "Enter Secure Workspace"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
