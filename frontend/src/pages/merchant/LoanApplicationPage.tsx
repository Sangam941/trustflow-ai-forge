import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lock, TrendingUp, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useScore } from "@/context/ScoreContext";
import { api } from "@/lib/api";
import { toast } from "sonner";

const formatNPR = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(amount);
const MIN_LOAN_SCORE = 55;

const steps = ["Loan Details"];

export default function LoanApplicationPage() {
  const { score, loanTier: tier, loading } = useScore();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Loan Application — Hamisathi";
  }, []);

  const [amount, setAmount] = useState(tier ? Math.min(50000, tier.maxLoan) : 50000);
  const [term, setTerm] = useState(12);
  const [purpose, setPurpose] = useState("Inventory expansion");
  const [submitting, setSubmitting] = useState(false);

  // Clamp amount when tier changes
  useEffect(() => {
    if (tier && amount > tier.maxLoan) setAmount(tier.maxLoan);
  }, [tier, amount]);

  const emi = Math.round((amount * (1 + 0.18 * (term / 12))) / term);
  const pointsNeeded = Math.max(0, MIN_LOAN_SCORE - score);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;

  if (!tier) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Loan Application</h1>
          <p className="text-sm text-muted-foreground">A minimum trust score of {MIN_LOAN_SCORE} is required to apply.</p>
        </div>
        <div className="rounded-2xl border bg-gradient-to-br from-destructive/10 via-surface to-surface shadow-soft p-8 text-center max-w-2xl mx-auto">
          <div className="size-14 rounded-full bg-destructive/15 grid place-items-center mx-auto">
            <Lock className="size-7 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mt-4">Loans are disabled for your score</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Your trust score is <span className="font-semibold text-foreground">{score}</span> with unstable income signals. Approval probability is very low, so loan applications are currently locked.
          </p>
          <div className="mt-6 grid sm:grid-cols-2 gap-3 text-left">
            <div className="rounded-xl border bg-surface p-4">
              <div className="text-xs text-muted-foreground">Current score</div>
              <div className="text-2xl font-bold mt-1">{score}</div>
            </div>
            <div className="rounded-xl border bg-surface p-4">
              <div className="text-xs text-muted-foreground">Need at least</div>
              <div className="text-2xl font-bold mt-1 text-gradient-ai">{MIN_LOAN_SCORE}</div>
              <div className="text-xs text-muted-foreground mt-1">{pointsNeeded} more points</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link to="/merchant/ai-coach" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-ai text-ai-foreground text-sm font-medium hover:opacity-90 shadow-elegant">
              <TrendingUp className="size-4" /> Improve with AI Coach
            </Link>
            <Link to="/merchant/pay-bills" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border bg-surface text-sm font-medium hover:bg-muted">
              Pay Bills to Build Score
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const step = 0;
  const approvalColor =
    tier.approvalLabel === "HIGH" ? "text-success" :
    tier.approvalLabel === "MEDIUM" ? "text-warning" : "text-destructive";

  const submitApplication = async () => {
    setSubmitting(true);
    try {
      await api.post("/loans/apply", { amountRequested: amount, termMonths: term, purpose });
      toast.success("Loan application submitted successfully!");
      navigate("/merchant/dashboard");
    } catch (e: any) {
      toast.error(e.message || "Failed to submit loan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Loan Application</h1>
        <p className="text-sm text-muted-foreground">Your loan tier is calculated from your live trust score.</p>
      </div>

      {/* Tier banner */}
      <div className="rounded-2xl border bg-gradient-to-br from-ai/10 via-surface to-surface shadow-soft p-5 grid sm:grid-cols-4 gap-4">
        <div>
          <div className="text-xs text-muted-foreground">Trust score</div>
          <div className="text-2xl font-bold mt-1">{score}</div>
          <div className="text-xs text-muted-foreground">{tier.label} tier</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Max loan</div>
          <div className="text-2xl font-bold mt-1 text-gradient-ai">{formatNPR(tier.maxLoan)}</div>
          <div className="text-xs text-muted-foreground">{tier.incomeNote}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Approval</div>
          <div className={`text-2xl font-bold mt-1 ${approvalColor}`}>{tier.approvalLabel}</div>
          <div className="text-xs text-muted-foreground">{tier.approvalRange}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Interest</div>
          <div className="text-2xl font-bold mt-1">18%</div>
          <div className="text-xs text-muted-foreground">per annum</div>
        </div>
      </div>

      {/* Stepper */}
      <div className="rounded-2xl bg-surface border shadow-soft p-6">
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`size-8 rounded-full grid place-items-center text-xs font-semibold transition
                ${i < step ? "bg-success text-success-foreground" : i === step ? "bg-gradient-ai text-ai-foreground" : "bg-muted text-muted-foreground"}`}>
                {i < step ? <Check className="size-4" /> : i + 1}
              </div>
              <div className={`text-xs font-medium hidden md:block ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</div>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? "bg-success" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="space-y-5">
                <div>
                  <label className="text-sm font-medium">Loan amount</label>
                  <div className="text-3xl font-semibold mt-1 text-gradient-ai">{formatNPR(amount)}</div>
                  <input type="range" min={5000} max={tier.maxLoan} step={1000} value={amount} onChange={e => setAmount(+e.target.value)}
                    className="w-full mt-2 accent-[var(--ai)]" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Rs. 5,000</span><span>Capped at {formatNPR(tier.maxLoan)} for {tier.label} tier</span>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Repayment term</label>
                    <select value={term} onChange={e => setTerm(+e.target.value)}
                      className="mt-1.5 w-full h-11 px-3 rounded-lg border bg-surface outline-none">
                      {[6, 12, 18, 24, 36].map(t => <option key={t} value={t}>{t} months</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Purpose</label>
                    <select value={purpose} onChange={e => setPurpose(e.target.value)}
                      className="mt-1.5 w-full h-11 px-3 rounded-lg border bg-surface outline-none">
                      {["Inventory expansion","Equipment purchase","Working capital","Shop renovation","New location"].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-end mt-8">
              <button disabled={submitting} onClick={submitApplication} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-ai text-ai-foreground text-sm font-medium hover:opacity-90 shadow-elegant disabled:opacity-50">
                {submitting ? <Loader2 className="size-4 animate-spin" /> : <>Submit Application <Check className="size-4" /></>}
              </button>
            </div>
          </div>

          {/* Side EMI summary */}
          <div className="rounded-2xl border bg-gradient-to-br from-ai/10 via-surface to-surface p-5 h-fit space-y-3">
            <div className="text-xs uppercase tracking-wider text-ai font-semibold">EMI Calculator</div>
            <div className="text-3xl font-bold">{formatNPR(emi)}</div>
            <div className="text-xs text-muted-foreground">per month for {term} months</div>
            <div className="h-px bg-border my-2" />
            <Row k="Approval probability" v={`~${tier.approval}% (${tier.approvalLabel})`} />
            <Row k="Recommended amount" v={formatNPR(Math.round(Math.min(amount, tier.maxLoan) * 0.92))} />
            <Row k="Interest rate" v="18% p.a." />
            <Row k="Total payable" v={formatNPR(emi * term)} />
          </div>
        </div>
      </div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}
