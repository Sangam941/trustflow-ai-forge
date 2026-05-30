import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Zap, Wifi, Droplets, Smartphone, CheckCircle2, Clock, AlertTriangle, X, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useScore, type Bill } from "@/context/ScoreContext";
import { formatNPR } from "@/data/mockData";

export const Route = createFileRoute("/merchant/pay-bills")({
  head: () => ({ meta: [{ title: "Pay Bills — Hamisathi" }] }),
  component: PayBills,
});

const icons: Record<Bill["type"], React.ComponentType<{ className?: string }>> = {
  Electricity: Zap,
  Internet: Wifi,
  Water: Droplets,
  Mobile: Smartphone,
};

function scoreStatus(score: number) {
  if (score >= 750) return { label: "Excellent", cls: "bg-success/15 text-success border-success/30" };
  if (score >= 650) return { label: "Good", cls: "bg-primary/15 text-primary border-primary/30" };
  if (score >= 550) return { label: "Fair", cls: "bg-warning/15 text-warning border-warning/30" };
  return { label: "Low", cls: "bg-destructive/15 text-destructive border-destructive/30" };
}

function PayBills() {
  const { score, bills, activities, payBill } = useScore();
  const [open, setOpen] = useState<Bill | null>(null);
  const [method, setMethod] = useState("Wallet");
  const status = scoreStatus(score);

  const confirm = () => {
    if (!open) return;
    const res = payBill(open.id);
    if (res) {
      if (res.delta > 0) toast.success(`Payment successful · +${res.delta} trust score`);
      else toast.error(`Late payment · ${res.delta} trust score`);
    }
    setOpen(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Pay Bills</h1>
        <p className="text-sm text-muted-foreground">Build your trust score by paying utility bills on time.</p>
      </div>

      {/* Score header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border shadow-soft p-6 bg-gradient-to-br from-primary/10 via-surface to-surface">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Trust Score</div>
            <div className="flex items-end gap-3 mt-1">
              <AnimatePresence mode="popLayout">
                <motion.div key={score} initial={{ y: 10, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -10, opacity: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  className="text-6xl font-bold tabular-nums text-gradient-ai">
                  {score}
                </motion.div>
              </AnimatePresence>
              <span className={`px-2.5 py-1 rounded-full border text-xs font-medium ${status.cls}`}>{status.label}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Based on simulated financial behavior</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="size-4 text-ai" /> Pay on time: <span className="text-success font-semibold">+15</span> · Late: <span className="text-destructive font-semibold">−10</span>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bills grid */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {bills.map((b, i) => {
            const Icon = icons[b.type];
            const isPaid = b.status === "paid";
            const isLate = b.status === "late" || (isPaid && b.onTime === false);
            return (
              <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl bg-surface border shadow-soft p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><Icon className="size-5" /></div>
                    <div>
                      <div className="font-semibold">{b.type}</div>
                      <div className="text-[11px] text-muted-foreground">Due {new Date(b.dueDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border inline-flex items-center gap-1
                    ${isPaid ? "bg-success/10 text-success border-success/30" : isLate ? "bg-destructive/10 text-destructive border-destructive/30" : "bg-warning/10 text-warning border-warning/30"}`}>
                    {isPaid ? <CheckCircle2 className="size-3" /> : isLate ? <AlertTriangle className="size-3" /> : <Clock className="size-3" />}
                    {isPaid ? "Paid" : isLate ? "Late" : "Pending"}
                  </span>
                </div>
                <div className="text-2xl font-bold tabular-nums">{formatNPR(b.amount)}</div>
                <button disabled={isPaid} onClick={() => setOpen(b)}
                  className="mt-auto h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition">
                  {isPaid ? `Paid ${b.paidDate ? "· " + b.paidDate : ""}` : "Pay Now"}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Activity feed */}
        <div className="rounded-2xl bg-surface border shadow-soft p-5">
          <h3 className="font-semibold">Activity Feed</h3>
          <p className="text-[11px] text-muted-foreground">Live impact on your trust score</p>
          <div className="mt-4 space-y-3">
            {activities.length === 0 && (
              <div className="text-xs text-muted-foreground rounded-lg border border-dashed p-4 text-center">
                No activity yet. Pay a bill to see updates.
              </div>
            )}
            <AnimatePresence initial={false}>
              {activities.map((a) => (
                <motion.div key={a.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  className="relative pl-4">
                  <span className={`absolute left-0 top-1.5 size-2 rounded-full ${a.delta >= 0 ? "bg-success" : "bg-destructive"}`} />
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm">{a.text}</div>
                    <div className={`text-xs font-semibold ${a.delta >= 0 ? "text-success" : "text-destructive"}`}>
                      {a.delta > 0 ? "+" : ""}{a.delta}
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground">{new Date(a.at).toLocaleString()}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.div onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-surface border shadow-xl p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Confirm Payment</h3>
                <button onClick={() => setOpen(null)} className="size-8 grid place-items-center rounded-lg hover:bg-muted"><X className="size-4" /></button>
              </div>
              <div className="mt-4 rounded-xl bg-muted/40 p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Bill</span><span className="font-medium">{open.type}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-semibold tabular-nums">{formatNPR(open.amount)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Due Date</span><span>{new Date(open.dueDate).toLocaleDateString()}</span></div>
              </div>
              <div className="mt-4">
                <label className="text-xs font-medium text-muted-foreground">Payment Method</label>
                <select value={method} onChange={(e) => setMethod(e.target.value)}
                  className="mt-1 w-full h-10 rounded-lg border bg-surface px-3 text-sm outline-none focus:border-primary">
                  <option>Wallet</option>
                  <option>Bank Transfer</option>
                  <option>eSewa (Mock)</option>
                </select>
              </div>
              <button onClick={confirm}
                className="mt-5 w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
                Confirm Payment
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
