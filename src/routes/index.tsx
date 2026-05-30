import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Sparkles, Brain, Users, Receipt, ShieldCheck, LineChart, ArrowRight, CheckCircle2, Activity,
} from "lucide-react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { adminStats } from "@/data/mockData";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hamisathi — Financial Inclusion Through AI" },
      { name: "description", content: "Alternative credit scoring platform for Nepal's unbanked merchants. Powered by behavioral and alternative financial data." },
    ],
  }),
  component: Landing,
});

const sparkData = Array.from({ length: 24 }, (_, i) => ({ v: 50 + Math.sin(i / 2) * 20 + i * 1.6 }));

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span>{n.toLocaleString()}{suffix}</span>;
}

const features = [
  { icon: Brain, title: "AI Credit Scoring", text: "Machine learning models that look beyond traditional credit history.", accent: "ai" },
  { icon: Activity, title: "Behavioral Analysis", text: "Daily transaction patterns become signals of merchant reliability.", accent: "primary" },
  { icon: Users, title: "Community Trust Engine", text: "Verified references and guarantor networks strengthen scores.", accent: "success" },
  { icon: Receipt, title: "Bill Payment Intelligence", text: "Electricity, water and internet payments inform creditworthiness.", accent: "ai" },
  { icon: ShieldCheck, title: "Risk Monitoring", text: "Continuous portfolio monitoring with early-warning indicators.", accent: "primary" },
  { icon: Sparkles, title: "Explainable AI", text: "Every decision comes with a clear, human-readable rationale.", accent: "ai" },
];

const steps = [
  "Create Business Profile",
  "Provide Financial Information",
  "Generate Trust Score",
  "Apply for Loan",
  "Get AI Recommendation",
];

function Landing() {
  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ai/10 text-ai text-xs font-medium border border-ai/20">
              <Sparkles className="size-3.5" /> Powered by Explainable AI
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="mt-5 text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight">
              Financial Inclusion<br />
              Through <span className="text-gradient-ai">AI</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="mt-5 text-lg text-muted-foreground max-w-xl">
              Alternative credit scoring for Nepal's unbanked merchants. We use behavioral, transaction and community-trust signals to help lenders extend capital — confidently.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 shadow-elegant">
                Get Started <ArrowRight className="size-4" />
              </Link>
              <Link to="/merchant/dashboard" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border bg-surface hover:bg-muted font-medium">
                View Demo
              </Link>
            </motion.div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              {["No collateral required", "5-minute setup", "Explainable"].map(t => (
                <div key={t} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" /> {t}</div>
              ))}
            </div>
          </div>

          {/* Animated dashboard preview */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="relative">
            <div className="rounded-3xl bg-surface border shadow-elegant p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Merchant trust score</div>
                  <div className="text-3xl font-semibold mt-1">847</div>
                  <div className="text-xs text-success mt-1">+24 this month</div>
                </div>
                <div className="size-12 rounded-xl bg-gradient-ai grid place-items-center text-ai-foreground">
                  <ShieldCheck className="size-5" />
                </div>
              </div>
              <div className="h-32 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparkData}>
                    <defs>
                      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--ai)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="var(--ai)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area dataKey="v" stroke="var(--ai)" strokeWidth={2} fill="url(#g)" />
                    <Tooltip cursor={false} contentStyle={{ display: "none" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {[
                  { l: "Approval", v: "92%", c: "text-success" },
                  { l: "Risk", v: "Low", c: "text-success" },
                  { l: "Eligible", v: "Rs. 450k", c: "text-foreground" },
                ].map(s => (
                  <div key={s.l} className="rounded-xl bg-muted/50 p-3">
                    <div className="text-[10px] uppercase text-muted-foreground">{s.l}</div>
                    <div className={`text-sm font-semibold mt-0.5 ${s.c}`}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}
              className="absolute -left-6 -bottom-6 rounded-2xl bg-surface border shadow-elegant p-4 w-56">
              <div className="flex items-center gap-2 text-xs">
                <Sparkles className="size-4 text-ai" />
                <span className="font-medium">AI Insight</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Bill payments raised your score by +12 points</div>
            </motion.div>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity }}
              className="absolute -right-4 -top-4 rounded-2xl bg-surface border shadow-elegant p-3 flex items-center gap-3">
              <div className="size-8 rounded-lg bg-success/10 text-success grid place-items-center"><LineChart className="size-4" /></div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground">Cash flow</div>
                <div className="text-sm font-semibold">+18.4%</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-wider text-ai font-semibold">Capabilities</div>
          <h2 className="mt-3 text-4xl font-bold tracking-tight">Credit intelligence for the next billion</h2>
          <p className="mt-3 text-muted-foreground">Built specifically for emerging-market lending realities.</p>
        </div>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-2xl border bg-surface p-6 hover:shadow-elegant transition-shadow">
              <div className={`size-11 rounded-xl grid place-items-center ${f.accent === "ai" ? "bg-ai/10 text-ai" : f.accent === "success" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-6 py-24 border-t">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-wider text-ai font-semibold">How it works</div>
          <h2 className="mt-3 text-4xl font-bold tracking-tight">From signup to capital in 5 steps</h2>
        </div>
        <div className="mt-14 grid md:grid-cols-5 gap-4">
          {steps.map((s, i) => (
            <motion.div key={s}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-2xl border bg-surface p-5">
              <div className="size-10 rounded-xl bg-gradient-ai text-ai-foreground grid place-items-center font-semibold">
                {i + 1}
              </div>
              <div className="mt-3 font-medium text-sm">{s}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-3xl bg-gradient-navy text-navy-foreground p-10 md:p-14 grid md:grid-cols-4 gap-8">
          {[
            { label: "Total Merchants", value: adminStats.totalMerchants * 24, suffix: "+" },
            { label: "Loans Evaluated", value: 12480, suffix: "" },
            { label: "Avg Trust Score", value: adminStats.avgTrustScore, suffix: "" },
            { label: "Approval Rate", value: 78, suffix: "%" },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}>
              <div className="text-4xl md:text-5xl font-bold tracking-tight">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-sm text-navy-foreground/70">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-4xl font-bold tracking-tight">Ready to unlock credit access?</h2>
        <p className="mt-3 text-muted-foreground">Join the merchants and lenders building Nepal's inclusive financial future.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/register" className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 shadow-elegant">Get Started</Link>
          <Link to="/features" className="px-5 py-3 rounded-xl border bg-surface hover:bg-muted font-medium">Explore Features</Link>
        </div>
      </section>
    </PublicLayout>
  );
}
