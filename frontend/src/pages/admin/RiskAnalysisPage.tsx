import { useEffect } from "react";
import { portfolioRiskByCategory, riskDistribution, approvalTrend } from "@/data/mockData";
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

const PIE_COLORS = ["var(--chart-2)", "var(--chart-1)", "var(--chart-5)"];

export default function RiskAnalysisPage() {
  useEffect(() => {
    document.title = "Risk Analysis — Hamisathi";
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Risk Analysis</h1>
        <p className="text-sm text-muted-foreground">Distribution and trend analysis across the portfolio.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Kpi label="Portfolio Risk Index" value="2.4" sub="Low — stable" tone="success" />
        <Kpi label="Default Probability" value="3.8%" sub="Below industry avg" tone="success" />
        <Kpi label="Risk-Adjusted Yield" value="11.2%" sub="+0.6% vs Q1" tone="ai" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-surface border shadow-soft p-6">
          <h3 className="font-semibold">Risk Distribution</h3>
          <div className="h-72 mt-3">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={riskDistribution} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
                  {riskDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl bg-surface border shadow-soft p-6">
          <h3 className="font-semibold">Approval Performance</h3>
          <div className="h-72 mt-3">
            <ResponsiveContainer>
              <AreaChart data={approvalTrend}>
                <defs>
                  <linearGradient id="ra" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--ai)" stopOpacity={0.35} /><stop offset="100%" stopColor="var(--ai)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area dataKey="approved" stroke="var(--ai)" strokeWidth={2} fill="url(#ra)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-surface border shadow-soft p-6">
        <h3 className="font-semibold">Risk Heatmap by Category</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4">
          {portfolioRiskByCategory.map(c => {
            const total = c.low + c.medium + c.high;
            const riskScore = (c.high * 3 + c.medium * 2 + c.low) / total;
            const intensity = Math.min(1, Math.max(0.2, riskScore / 3));
            return (
              <div key={c.category}
                className="aspect-square rounded-xl grid place-items-center text-center p-2"
                style={{ background: `color-mix(in oklab, var(--destructive) ${Math.round(intensity * 70)}%, var(--surface))`, color: intensity > 0.6 ? "white" : "inherit" }}>
                <div>
                  <div className="text-xs font-semibold">{c.category}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">{Math.round(riskScore * 33)}% risk</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: "success" | "ai" }) {
  const accent = tone === "success" ? "bg-success/10 text-success" : "bg-ai/10 text-ai";
  return (
    <div className="rounded-2xl bg-surface border shadow-soft p-5">
      <div className={`text-xs uppercase font-semibold tracking-wider inline-block px-2 py-0.5 rounded ${accent}`}>{label}</div>
      <div className="text-3xl font-bold mt-3">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}
