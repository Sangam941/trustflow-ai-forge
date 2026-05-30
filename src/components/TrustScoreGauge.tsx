import { motion } from "framer-motion";

export function TrustScoreGauge({ score }: { score: number }) {
  const pct = Math.min(1, Math.max(0, score / 1000));
  const radius = 90;
  const c = 2 * Math.PI * radius;
  const offset = c * (1 - pct * 0.75); // 3/4 arc
  const label = score >= 720 ? "Excellent" : score >= 580 ? "Good" : score >= 460 ? "Fair" : "Needs Work";
  const color = score >= 720 ? "var(--success)" : score >= 580 ? "var(--ai)" : score >= 460 ? "var(--warning)" : "var(--destructive)";

  return (
    <div className="relative size-56 mx-auto">
      <svg viewBox="0 0 220 220" className="-rotate-[135deg]">
        <circle cx="110" cy="110" r={radius} fill="none" stroke="var(--muted)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${c * 0.75} ${c}`} />
        <motion.circle cx="110" cy="110" r={radius} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${c * 0.75} ${c}`}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Trust Score</div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
          className="text-5xl font-bold mt-1">{score}</motion.div>
        <div className="text-sm font-medium mt-1" style={{ color }}>{label}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">out of 1000</div>
      </div>
    </div>
  );
}
