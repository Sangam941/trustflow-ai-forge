import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Check } from "lucide-react";
import { useAuth, type Role } from "@/context/AuthContext";


export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Hamisathi" }] }),
  component: Register,
});

function Register() {
  const [role, setRole] = useState<Role>("merchant");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ name: name || "Demo User", email: email || "demo@trustfund.ai", role });
    navigate({ to: role === "admin" ? "/admin/dashboard" : "/onboarding" });
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-8 order-2 md:order-1">
        <motion.form onSubmit={submit} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-5">
          <div>
            <h2 className="text-2xl font-semibold">Create your account</h2>
            <p className="text-sm text-muted-foreground mt-1">Start building your trust score in minutes.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
            {(["merchant", "admin"] as Role[]).map(r => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`py-2.5 text-sm rounded-lg font-medium capitalize transition ${role === r ? "bg-surface shadow-soft" : "text-muted-foreground"}`}>
                {r === "admin" ? "eSewa Admin" : "Merchant"}
              </button>
            ))}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Full name</label>
            <input value={name} onChange={e => setName(e.target.value)} required placeholder="Anish Shrestha"
              className="mt-1.5 w-full h-11 px-3 rounded-lg border bg-surface outline-none focus:ring-2 focus:ring-ai/30" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="you@business.com"
              className="mt-1.5 w-full h-11 px-3 rounded-lg border bg-surface outline-none focus:ring-2 focus:ring-ai/30" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Password</label>
            <input type="password" required defaultValue="demo1234"
              className="mt-1.5 w-full h-11 px-3 rounded-lg border bg-surface outline-none focus:ring-2 focus:ring-ai/30" />
          </div>
          <button type="submit" className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 inline-flex items-center justify-center gap-2 shadow-elegant">
            Create account <ArrowRight className="size-4" />
          </button>
          <div className="text-sm text-center text-muted-foreground">
            Already have an account? <Link to="/login" className="text-ai font-medium">Sign in</Link>
          </div>
        </motion.form>
      </div>
      <div className="hidden md:flex bg-gradient-navy text-navy-foreground p-12 flex-col justify-between relative overflow-hidden order-1 md:order-2">
        <Link to="/" className="flex items-center gap-2 font-semibold relative z-10">
          <div className="size-8 rounded-lg bg-gradient-ai grid place-items-center"><Shield className="size-4" /></div>
          Hami<span className="text-gradient-ai">sathi</span>
        </Link>
        <div className="relative z-10 space-y-5">
          <h1 className="text-4xl font-bold leading-tight">Join thousands building credit history with AI.</h1>
          <ul className="space-y-3 text-navy-foreground/80">
            {["Free trust-score generation","Personalized AI credit coach","Instant loan eligibility preview"].map(t => (
              <li key={t} className="flex items-center gap-3"><span className="size-6 rounded-full bg-ai/30 grid place-items-center"><Check className="size-3.5" /></span>{t}</li>
            ))}
          </ul>
        </div>
        <div className="text-xs text-navy-foreground/50 relative z-10">© Hamisathi · Alternative Credit Intelligence</div>
        <div className="absolute -top-20 -right-20 size-96 rounded-full bg-ai/30 blur-3xl" />
      </div>
    </div>
  );
}
