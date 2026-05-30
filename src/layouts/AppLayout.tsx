import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, User, Gauge, FileText, FilePlus2, Eye, Sparkles, Settings, LogOut, Bell, Search, Shield
} from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

const merchantNav = [
  { to: "/merchant/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/merchant/credit-score", label: "Credit Score", icon: Gauge },
  { to: "/merchant/loan-application", label: "Apply for Loan", icon: FilePlus2 },
  { to: "/merchant/loan-review", label: "Loan Review", icon: Eye },
  { to: "/merchant/documents", label: "Documents", icon: FileText },
  { to: "/merchant/ai-coach", label: "AI Coach", icon: Sparkles },
  { to: "/merchant/profile", label: "Profile", icon: User },
  { to: "/merchant/settings", label: "Settings", icon: Settings },
];

const adminNav = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/merchants", label: "Merchants", icon: User },
  { to: "/admin/risk-analysis", label: "Risk Analysis", icon: Gauge },
  { to: "/admin/loan-reviews", label: "Loan Reviews", icon: Eye },
  { to: "/admin/portfolio", label: "Portfolio", icon: FileText },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AppLayout({ role, children }: { role: "merchant" | "admin"; children: ReactNode }) {
  const nav = role === "merchant" ? merchantNav : adminNav;
  const { location } = useRouterState();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name || (role === "admin" ? "eSewa Admin" : "Shrestha Store");

  return (
    <div className="min-h-screen bg-surface-muted flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground sticky top-0 h-screen">
        <div className="px-6 h-16 flex items-center gap-2 border-b border-sidebar-border">
          <div className="size-8 rounded-lg bg-gradient-ai grid place-items-center">
            <Shield className="size-4 text-ai-foreground" />
          </div>
          <div className="font-semibold">Hami<span className="text-gradient-ai">sathi</span></div>
        </div>
        <div className="px-3 py-4 text-[11px] uppercase tracking-wider text-sidebar-foreground/60">
          {role === "merchant" ? "Merchant Portal" : "Risk Intelligence"}
        </div>
        <nav className="px-3 space-y-1 flex-1">
          {nav.map(item => {
            const active = location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition relative
                  ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"}`}>
                {active && (
                  <motion.div layoutId="active-pill" className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-sidebar-primary" />
                )}
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <button onClick={() => { logout(); navigate({ to: "/" }); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition">
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-surface/80 backdrop-blur border-b flex items-center px-6 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input placeholder="Search…" className="w-full h-10 pl-9 pr-3 rounded-lg bg-muted/60 border border-transparent focus:bg-surface focus:border-border outline-none text-sm" />
          </div>
          <button className="size-10 grid place-items-center rounded-lg hover:bg-muted relative">
            <Bell className="size-4" />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-destructive" />
          </button>
          <div className="flex items-center gap-3 pl-3 border-l">
            <div className="size-9 rounded-full bg-gradient-ai grid place-items-center text-ai-foreground text-sm font-semibold">
              {displayName.split(" ").map(s => s[0]).slice(0, 2).join("")}
            </div>
            <div className="hidden md:block leading-tight">
              <div className="text-sm font-medium">{displayName}</div>
              <div className="text-xs text-muted-foreground capitalize">{role}</div>
            </div>
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.main key={location.pathname}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="p-6 lg:p-8 flex-1">
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
