import { createFileRoute } from "@tanstack/react-router";
import { TrustScoreGauge } from "@/components/TrustScoreGauge";
import { currentMerchant, scoreBreakdown, trustScoreHistory } from "@/data/mockData";
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { motion } from "framer-motion";

export const Route = createFileRoute("/merchant/credit-score")({
  head: () => ({ meta: [{ title: "Credit Score — TrustFund AI" }] }),
  component: CreditScore,
});

function CreditScore() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Your Credit Score</h1>
        <p className="text-sm text-muted-foreground">Detailed breakdown of every signal feeding your trust score.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-surface p-6 border shadow-soft">
          <TrustScoreGauge score={currentMerchant.trustScore} />
        </div>

        <div className="rounded-2xl bg-surface p-6 border shadow-soft lg:col-span-2">
          <h3 className="font-semibold">12-Month Trust Score History</h3>
          <div className="h-64 mt-3">
            <ResponsiveContainer>
              <LineChart data={trustScoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} domain={[500, 900]} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Line dataKey="score" stroke="var(--ai)" strokeWidth={3} dot={{ r: 4, fill: "var(--ai)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-surface p-6 border shadow-soft">
        <h3 className="font-semibold">Score Components</h3>
        <div className="mt-4 space-y-4">
          {scoreBreakdown.map((s, i) => (
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
    </div>
  );
}
