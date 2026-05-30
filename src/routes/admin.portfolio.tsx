import { createFileRoute } from "@tanstack/react-router";
import { financialTrend, portfolioRiskByCategory } from "@/data/mockData";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["var(--chart-1)","var(--chart-2)","var(--chart-3)","var(--chart-4)","var(--chart-5)","var(--ai)"];

export const Route = createFileRoute("/admin/portfolio")({
  head: () => ({ meta: [{ title: "Portfolio — Hamisathi" }] }),
  component: () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Portfolio Monitoring</h1>
        <p className="text-sm text-muted-foreground">Live view of disbursed capital, recovery and category mix.</p>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        {[
          ["Disbursed", "Rs. 14.2 Cr", "+8.1% MoM"],
          ["Outstanding", "Rs. 9.8 Cr", "On schedule"],
          ["Recovery rate", "94.6%", "+0.4% MoM"],
          ["NPA", "1.8%", "-0.3% MoM"],
        ].map(([k, v, s]) => (
          <div key={k} className="rounded-2xl bg-surface border shadow-soft p-5">
            <div className="text-xs uppercase text-muted-foreground tracking-wider">{k}</div>
            <div className="text-2xl font-semibold mt-2">{v}</div>
            <div className="text-xs text-success mt-1">{s}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-surface border shadow-soft p-6">
          <h3 className="font-semibold">Portfolio Performance</h3>
          <div className="h-72 mt-3">
            <ResponsiveContainer>
              <AreaChart data={financialTrend}>
                <defs>
                  <linearGradient id="pa" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--ai)" stopOpacity={0.35} /><stop offset="100%" stopColor="var(--ai)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area dataKey="net" stroke="var(--ai)" strokeWidth={2} fill="url(#pa)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-surface border shadow-soft p-6">
          <h3 className="font-semibold">Category Distribution</h3>
          <div className="h-72 mt-3">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={portfolioRiskByCategory.map(c => ({ name: c.category, value: c.low + c.medium + c.high }))}
                  dataKey="value" nameKey="name" outerRadius={95}>
                  {portfolioRiskByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  ),
});
