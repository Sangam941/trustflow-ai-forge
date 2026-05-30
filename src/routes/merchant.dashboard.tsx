import { createFileRoute, Link } from "@tanstack/react-router";
import { StatCard } from "@/components/StatCard";
import { TrustScoreGauge } from "@/components/TrustScoreGauge";
import { currentMerchant, financialTrend, billPayments, aiInsights, formatNPR } from "@/data/mockData";
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Legend,
} from "recharts";
import { Gauge, ShieldCheck, Wallet, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/merchant/dashboard")({
  head: () => ({ meta: [{ title: "Merchant Dashboard — Hamisathi" }] }),
  component: Dashboard,
});

function Dashboard() {
  const m = currentMerchant;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, {m.owner.split(" ")[0]}</h1>
          <p className="text-sm text-muted-foreground">Here's your credit and business overview for this month.</p>
        </div>
        <Link to="/merchant/loan-application" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 shadow-soft">
          Apply for loan <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard index={0} label="Trust Score" value={m.trustScore} delta={3} icon={<Gauge className="size-5" />} accent="ai" />
        <StatCard index={1} label="Risk Level" value={m.risk} icon={<ShieldCheck className="size-5" />} accent={m.risk === "Low" ? "success" : "warning"} />
        <StatCard index={2} label="Loan Eligibility" value={formatNPR(m.loanAmount)} delta={12} icon={<Wallet className="size-5" />} accent="default" />
        <StatCard index={3} label="Business Health" value="Strong" delta={5} icon={<TrendingUp className="size-5" />} accent="success" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-surface p-6 border shadow-soft">
          <h3 className="font-semibold">Trust Score</h3>
          <p className="text-xs text-muted-foreground">Updated 2 hours ago</p>
          <div className="mt-2"><TrustScoreGauge score={m.trustScore} /></div>
          <div className="grid grid-cols-3 gap-2 mt-2 text-center">
            <div className="rounded-lg bg-muted/50 py-2">
              <div className="text-[10px] uppercase text-muted-foreground">Trend</div>
              <div className="text-sm font-semibold text-success">+24</div>
            </div>
            <div className="rounded-lg bg-muted/50 py-2">
              <div className="text-[10px] uppercase text-muted-foreground">Class</div>
              <div className="text-sm font-semibold">{m.risk}</div>
            </div>
            <div className="rounded-lg bg-muted/50 py-2">
              <div className="text-[10px] uppercase text-muted-foreground">Approval</div>
              <div className="text-sm font-semibold">{m.approvalProbability}%</div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl bg-surface p-6 border shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Financial Analytics</h3>
              <p className="text-xs text-muted-foreground">Income vs. expense over 12 months</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-chart-1" /> Income</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-chart-2" /> Expense</span>
            </div>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer>
              <AreaChart data={financialTrend}>
                <defs>
                  <linearGradient id="ai-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="em-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area dataKey="income" stroke="var(--chart-1)" strokeWidth={2} fill="url(#ai-grad)" />
                <Area dataKey="expense" stroke="var(--chart-2)" strokeWidth={2} fill="url(#em-grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-surface p-6 border shadow-soft lg:col-span-2">
          <h3 className="font-semibold">Bill Payment Analysis</h3>
          <p className="text-xs text-muted-foreground">On-time vs late vs missed</p>
          <div className="h-64 mt-2">
            <ResponsiveContainer>
              <BarChart data={billPayments}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="onTime" stackId="a" fill="var(--success)" radius={[0,0,0,0]} />
                <Bar dataKey="late" stackId="a" fill="var(--warning)" />
                <Bar dataKey="missed" stackId="a" fill="var(--destructive)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>


        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-2xl p-6 border shadow-soft bg-gradient-to-br from-ai/10 via-surface to-surface">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-gradient-ai text-ai-foreground grid place-items-center"><Sparkles className="size-4" /></div>
            <h3 className="font-semibold">AI Credit Insights</h3>
          </div>
          <div className="mt-4 space-y-3">
            {aiInsights.map((i, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                className="rounded-xl bg-surface border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-medium">{i.title}</div>
                  <div className={`text-xs font-semibold ${i.type === "warning" ? "text-destructive" : "text-success"}`}>{i.impact}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{i.text}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
