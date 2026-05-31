import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";
import { useAuth, type Role } from "@/context/AuthContext";
import { api } from "@/lib/api";
export default function LoginPage() {
  const [role, setRole] = useState<Role>("merchant");
  const [email, setEmail] = useState("demo@trustfund.ai");
  const [password, setPassword] = useState("demo1234");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Sign in — Hamisathi";
  }, []);

  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.token, res.user);
      navigate(res.user.role === "admin" ? "/admin/dashboard" : "/merchant/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex bg-gradient-navy text-navy-foreground p-12 flex-col justify-between relative overflow-hidden">
        <Link to="/" className="flex items-center gap-2 font-semibold relative z-10">
          <div className="size-8 rounded-lg bg-gradient-ai grid place-items-center"><Shield className="size-4" /></div>
          Hami<span className="text-gradient-ai">sathi</span>
        </Link>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold leading-tight">Welcome back to the future of credit.</h1>
          <p className="mt-3 text-navy-foreground/70 max-w-md">Sign in to manage your trust score, applications, and AI-driven lending insights.</p>
        </div>
        <div className="text-xs text-navy-foreground/50 relative z-10">© Hamisathi · Alternative Credit Intelligence</div>
        <div className="absolute -bottom-20 -right-20 size-96 rounded-full bg-ai/30 blur-3xl" />
        <div className="absolute top-20 -left-10 size-60 rounded-full bg-chart-3/30 blur-3xl" />
      </div>
      <div className="flex items-center justify-center p-8">
        <motion.form onSubmit={submit} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-5">
          <div>
            <h2 className="text-2xl font-semibold">Sign in</h2>
            <p className="text-sm text-muted-foreground mt-1">Choose your role and access your portal.</p>
          </div>

          {error && <div className="text-destructive text-sm font-medium">{error}</div>}

          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
            {(["merchant", "admin"] as Role[]).map(r => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`py-2.5 text-sm rounded-lg font-medium capitalize transition ${role === r ? "bg-surface shadow-soft" : "text-muted-foreground"}`}>
                {r === "admin" ? "eSewa Admin" : "Merchant"}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required
              className="mt-1.5 w-full h-11 px-3 rounded-lg border bg-surface outline-none focus:ring-2 focus:ring-ai/30" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" required
              className="mt-1.5 w-full h-11 px-3 rounded-lg border bg-surface outline-none focus:ring-2 focus:ring-ai/30" />
          </div>

          <button type="submit" className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 inline-flex items-center justify-center gap-2 shadow-elegant">
            Sign in <ArrowRight className="size-4" />
          </button>
          <div className="text-sm text-center text-muted-foreground">
            New here? <Link to="/register" className="text-ai font-medium">Create an account</Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
