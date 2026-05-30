import { createFileRoute } from "@tanstack/react-router";
import { TrustScoreGauge } from "@/components/TrustScoreGauge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useScore } from "@/context/ScoreContext";


export const Route = createFileRoute("/merchant/credit-score")({
  head: () => ({ meta: [{ title: "Credit Score — Hamisathi" }] }),
  component: CreditScore,
});

const componentWeights = [
  { name: "Financial", value: 30, color: "#6366f1" },
  { name: "Bill Payment", value: 20, color: "#10b981" },
  { name: "Transaction", value: 30, color: "#f59e0b" },
  { name: "Business Stability", value: 20, color: "#ec4899" },
];

function CreditScore() {
  const { score, delta, activities, components } = useScore();
  const visibleBreakdown = [
    { name: "Financial", value: components.financial },
    { name: "Bill Payment", value: components.billPayment },
    { name: "Transaction", value: components.transaction },
    { name: "Business Stability", value: components.businessStability },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Your Credit Score</h1>
          <p className="text-sm text-muted-foreground">Detailed breakdown of every signal feeding your trust score.</p>
        </div>
        {delta !== 0 && (
          <div className={`text-xs px-3 py-1.5 rounded-full border ${delta > 0 ? "bg-success/10 text-success border-success/30" : "bg-destructive/10 text-destructive border-destructive/30"}`}>
            Bill payment impact: <span className="font-semibold">{delta > 0 ? "+" : ""}{delta}</span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-surface p-6 border shadow-soft">
          <TrustScoreGauge score={score} />
        </div>

        <div className="rounded-2xl bg-surface p-6 border shadow-soft lg:col-span-2">
          <h3 className="font-semibold">Score Composition</h3>
          <p className="text-xs text-muted-foreground">How each component contributes to your overall trust score</p>
          <div className="h-72 mt-3">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={componentWeights}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={100}
                  paddingAngle={3}
                  label={(entry) => `${entry.value}%`}
                >
                  {componentWeights.map((e) => (
                    <Cell key={e.name} fill={e.color} stroke="var(--surface)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}
                  formatter={(v) => `${v}%`}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-surface p-6 border shadow-soft">
        <h3 className="font-semibold">Score Components</h3>
        <div className="mt-4 space-y-4">
          {visibleBreakdown.map((s, i) => (
            <motion.div key={s.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium">{s.name}</span>
                <span className="text-muted-foreground">{s.value}/100</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${s.value}%` }} transition={{ duration: 0.8, delay: i * 0.05 }}
                  className="h-full bg-gradient-ai rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-surface p-6 border shadow-soft">
        <h3 className="font-semibold">Recent Bill Payment Activity</h3>
        <p className="text-xs text-muted-foreground">Live impact from the Pay Bills page</p>
        <div className="mt-4 space-y-3">
          {activities.length === 0 && (
            <div className="text-xs text-muted-foreground rounded-lg border border-dashed p-4 text-center">No bill payments yet.</div>
          )}
          <AnimatePresence initial={false}>
            {activities.map((a) => (
              <motion.div key={a.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
                <div className="flex items-center gap-3">
                  <span className={`size-2 rounded-full ${a.delta >= 0 ? "bg-success" : "bg-destructive"}`} />
                  <div className="text-sm">{a.text}</div>
                </div>
                <div className={`text-xs font-semibold ${a.delta >= 0 ? "text-success" : "text-destructive"}`}>{a.delta > 0 ? "+" : ""}{a.delta}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
