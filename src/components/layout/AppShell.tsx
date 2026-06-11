import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { label: "Intelligence Feed", to: "/intelligence-feed", icon: "dynamic_feed" },
  { label: "SAR Queue", to: "/sar-review", icon: "assignment_late" },
  { label: "Entity Graph", to: "/entity-graph", icon: "account_tree" },
  { label: "Case Manager", to: "/dashboard", icon: "folder_shared" },
  { label: "Audit Ledger", to: "/audit-ledger", icon: "history_edu" },
  { label: "System Settings", to: "/system-settings", icon: "settings" },
] as const;

interface TopNavItem {
  label: string;
  to?: string;
}

interface AppShellProps {
  children: ReactNode;
  heading: string;
  subheading?: string;
  topNav?: TopNavItem[];
}

export default function AppShell({ children, heading, subheading, topNav = [] }: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(152,203,255,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(78,222,163,0.08),transparent_30%),linear-gradient(180deg,#0c1017_0%,#10131a_42%,#06080d_100%)] text-on-surface selection:bg-primary/20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10rem] top-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-tertiary/10 blur-3xl" />
        <div className="absolute inset-0 canvas-grid opacity-[0.035]" />
      </div>

      <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-slate-950/80 shadow-[24px_0_48px_rgba(0,0,0,0.48)] backdrop-blur-xl">
        <div className="p-6">
          <h1 className="text-xl font-black tracking-tight text-primary">Intelligence Ledger</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Synthetic Intelligence Unit</p>
        </div>

        <div className="px-4 pb-4">
          <Link to="/sar-report" className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-primary to-primary-container py-3 text-xs font-bold uppercase tracking-widest text-on-primary">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Draft Report
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all ${
                  active
                    ? "bg-slate-800/60 font-semibold text-primary shadow-[0_0_15px_rgba(152,203,255,0.1)]"
                    : "text-on-surface-variant hover:bg-slate-800/40 hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-white/10 p-4">
          <Link to="/sar-report" className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-primary to-primary-container py-3 text-xs font-bold uppercase tracking-widest text-on-primary">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            Generate New SAR
          </Link>

          <Link className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-on-surface-variant hover:bg-white/5 hover:text-on-surface" to="/profile">
            <span className="material-symbols-outlined text-[18px]">person</span>
            Profile Dashboard
          </Link>
          <Link className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-on-surface-variant hover:bg-white/5 hover:text-on-surface" to="/history">
            <span className="material-symbols-outlined text-[18px]">history</span>
            History
          </Link>
          <Link className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-on-surface-variant hover:bg-white/5 hover:text-on-surface" to="/risk-monitor">
            <span className="material-symbols-outlined text-[18px]">monitoring</span>
            Risk Monitor
          </Link>
        </div>
      </aside>

      <header className="fixed left-72 right-0 top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-slate-950/70 px-8 backdrop-blur-xl">
        <div className="flex items-center gap-8">
          <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">search</span>
            <input
              className="w-80 rounded-full border border-outline-variant bg-surface-container-highest/60 py-2 pl-10 pr-4 text-xs text-on-surface outline-none focus:border-primary"
              placeholder="Search ledger..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-right md:block">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface">
              {user?.name || "Unknown User"}
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
              {user?.role || "guest"}
            </p>
          </div>
          <button className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-on-surface">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-on-surface">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
          <button
            className="rounded-lg border border-white/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant transition hover:bg-white/5 hover:text-on-surface"
            onClick={onLogout}
            type="button"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="relative z-10 pl-72 pt-20">
        <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-8 px-6 py-8 lg:px-10">
          <div className="glass-panel-strong rounded-[28px] px-6 py-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)] md:px-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.35em] text-primary">Operational Console</p>
                <h1 className="text-3xl font-black tracking-tight md:text-4xl">{heading}</h1>
                {subheading && <p className="max-w-3xl text-sm leading-7 text-on-surface-variant">{subheading}</p>}
              </div>

              {topNav.length > 0 && (
                <nav className="flex flex-wrap gap-2">
                  {topNav.map((item) => {
                    const active = item.to ? location.pathname === item.to : false;
                    return item.to ? (
                      <Link
                        key={item.label}
                        className={`rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] transition ${
                          active
                            ? 'border-primary/40 bg-primary/10 text-primary'
                            : 'border-white/10 bg-white/5 text-on-surface-variant hover:border-white/20 hover:text-on-surface'
                        }`}
                        to={item.to}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span
                        key={item.label}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant"
                      >
                        {item.label}
                      </span>
                    );
                  })}
                </nav>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
