import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Brain, Activity, Users, Receipt, ShieldCheck, Sparkles } from "lucide-react";

const items = [
  { icon: Brain, t: "AI Credit Scoring", d: "Gradient-boosted ensembles trained on emerging-market behavioral data." },
  { icon: Activity, t: "Behavioral Analysis", d: "Daily customer volume, transaction cadence and seasonality patterns." },
  { icon: Users, t: "Community Trust", d: "Verified guarantors and peer references as social-graph signal." },
  { icon: Receipt, t: "Bill Payment Intelligence", d: "Utility on-time history as a proxy for repayment reliability." },
  { icon: ShieldCheck, t: "Risk Monitoring", d: "Real-time portfolio dashboards with early-warning triggers." },
  { icon: Sparkles, t: "Explainable AI", d: "Every decision shipped with a human-readable rationale for compliance." },
];


export const Route = createFileRoute("/features")({
  head: () => ({ meta: [{ title: "Features — Hamisathi" }, { name: "description", content: "Alternative credit scoring, behavioral analysis, and explainable AI for lending." }] }),
  component: () => (
    <PublicLayout>
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-wider text-ai font-semibold">Platform</div>
          <h1 className="mt-3 text-5xl font-bold tracking-tight">Everything you need to underwrite the underbanked</h1>
          <p className="mt-4 text-muted-foreground">Six interlocking modules powering the entire merchant lending lifecycle.</p>
        </div>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(i => (
            <div key={i.t} className="rounded-2xl border bg-surface p-6 hover:shadow-elegant transition">
              <div className="size-11 rounded-xl bg-ai/10 text-ai grid place-items-center"><i.icon className="size-5" /></div>
              <h3 className="mt-4 text-lg font-semibold">{i.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{i.d}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  ),
});
