import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";


export function StatCard({
  label, value, delta, icon, accent = "default", index = 0,
}: {
  label: string; value: ReactNode; delta?: number; icon?: ReactNode;
  accent?: "default" | "success" | "ai" | "warning";
  index?: number;
}) {
  const accentMap = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    ai: "bg-ai/10 text-ai",
    warning: "bg-warning/10 text-warning",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="rounded-2xl bg-surface p-5 shadow-soft border hover:shadow-elegant transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</div>
          <div className="text-2xl font-semibold mt-1.5">{value}</div>
        </div>
        {icon && <div className={`size-10 rounded-xl grid place-items-center ${accentMap[accent]}`}>{icon}</div>}
      </div>
      {delta !== undefined && (
        <div className={`mt-3 inline-flex items-center gap-1 text-xs font-medium ${delta >= 0 ? "text-success" : "text-destructive"}`}>
          {delta >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
          {delta >= 0 ? "+" : ""}{delta}% vs last month
        </div>
      )}
    </motion.div>
  );
}
