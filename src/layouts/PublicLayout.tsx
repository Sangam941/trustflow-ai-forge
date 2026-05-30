import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import type { ReactNode } from "react";


export function PublicLayout({ children }: { children: ReactNode }) {
  const { location } = useRouterState();
  const nav = [
    { to: "/", label: "Home" },
    { to: "/features", label: "Features" },
    { to: "/about", label: "About" },
  ];
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 glass">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="size-8 rounded-lg bg-gradient-ai grid place-items-center text-ai-foreground">
              <Shield className="size-4" />
            </div>
            <span>Hami<span className="text-gradient-ai">sathi</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map(n => (
              <Link key={n.to} to={n.to}
                className={`px-3 py-2 text-sm rounded-md transition-colors hover:bg-muted ${location.pathname === n.to ? "text-foreground" : "text-muted-foreground"}`}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-3 py-2 text-sm rounded-md hover:bg-muted">Log in</Link>
            <Link to="/register" className="px-3.5 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition shadow-soft">
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex-1">
        {children}
      </motion.main>
      <footer className="border-t mt-20">
        <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-muted-foreground flex flex-col md:flex-row gap-4 justify-between">
          <div>© {new Date().getFullYear()} Hamisathi — Alternative Credit Intelligence</div>
          <div className="flex gap-4">
            <Link to="/about">About</Link>
            <Link to="/features">Features</Link>
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
