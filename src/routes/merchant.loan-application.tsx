import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { formatNPR } from "@/data/mockData";

export const Route = createFileRoute("/merchant/loan-application")({
  head: () => ({ meta: [{ title: "Loan Application — Hamisathi" }] }),
  component: LoanApp,
});

const steps = ["Loan Details", "Business Info", "Financials", "Documents", "Review"];

function LoanApp() {
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(300000);
  const [term, setTerm] = useState(12);
  const [purpose, setPurpose] = useState("Inventory expansion");

  const emi = Math.round((amount * (1 + 0.14 * (term / 12))) / term);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Loan Application</h1>
        <p className="text-sm text-muted-foreground">Complete 5 quick steps to receive an instant AI recommendation.</p>
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
                {step === 0 && (
                  <>
                    <div>
                      <label className="text-sm font-medium">Loan amount</label>
                      <div className="text-3xl font-semibold mt-1 text-gradient-ai">{formatNPR(amount)}</div>
                      <input type="range" min={50000} max={2000000} step={10000} value={amount} onChange={e => setAmount(+e.target.value)}
                        className="w-full mt-2 accent-[var(--ai)]" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Rs. 50,000</span><span>Rs. 20,00,000</span>
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
                  </>
                )}
                {step === 1 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {["Business name","Category","Location","Years in business"].map(l => (
                      <div key={l}>
                        <label className="text-sm font-medium">{l}</label>
                        <input className="mt-1.5 w-full h-11 px-3 rounded-lg border bg-surface outline-none" defaultValue={l === "Business name" ? "Shrestha Store" : l === "Category" ? "Grocery" : l === "Location" ? "Kathmandu" : "6"} />
                      </div>
                    ))}
                  </div>
                )}
                {step === 2 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {["Monthly income","Monthly expense","Daily customers","Avg transaction"].map(l => (
                      <div key={l}>
                        <label className="text-sm font-medium">{l}</label>
                        <input className="mt-1.5 w-full h-11 px-3 rounded-lg border bg-surface outline-none" defaultValue={l.includes("income") ? "180000" : l.includes("expense") ? "120000" : l.includes("customers") ? "85" : "450"} />
                      </div>
                    ))}
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-3">
                    {["Business registration","Citizenship ID","Last 3 months bank statement","Utility bill"].map(d => (
                      <div key={d} className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed hover:border-ai/40 hover:bg-ai/5 transition cursor-pointer">
                        <div className="text-sm font-medium">{d}</div>
                        <div className="text-xs text-ai font-medium">Upload</div>
                      </div>
                    ))}
                  </div>
                )}
                {step === 4 && (
                  <div className="space-y-3">
                    <div className="rounded-xl bg-muted/50 p-4 grid sm:grid-cols-2 gap-4 text-sm">
                      <div><div className="text-muted-foreground text-xs">Amount</div><div className="font-semibold mt-1">{formatNPR(amount)}</div></div>
                      <div><div className="text-muted-foreground text-xs">Term</div><div className="font-semibold mt-1">{term} months</div></div>
                      <div><div className="text-muted-foreground text-xs">Purpose</div><div className="font-semibold mt-1">{purpose}</div></div>
                      <div><div className="text-muted-foreground text-xs">Estimated EMI</div><div className="font-semibold mt-1">{formatNPR(emi)}</div></div>
                    </div>
                    <div className="rounded-xl border bg-gradient-to-br from-ai/10 to-transparent p-4">
                      <div className="flex items-center gap-2"><Sparkles className="size-4 text-ai" /><div className="font-medium text-sm">Trust score impact</div></div>
                      <div className="text-xs text-muted-foreground mt-1">This application will not affect your trust score. Successful repayment may improve it by +25 points.</div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8">
              <button disabled={step === 0} onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border bg-surface disabled:opacity-40 hover:bg-muted text-sm">
                <ArrowLeft className="size-4" /> Back
              </button>
              {step < steps.length - 1 ? (
                <button onClick={() => setStep(step + 1)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 shadow-soft">
                  Continue <ArrowRight className="size-4" />
                </button>
              ) : (
                <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-ai text-ai-foreground text-sm font-medium hover:opacity-90 shadow-elegant">
                  Submit Application <Check className="size-4" />
                </button>
              )}
            </div>
          </div>

          {/* Side EMI summary */}
          <div className="rounded-2xl border bg-gradient-to-br from-ai/10 via-surface to-surface p-5 h-fit space-y-3">
            <div className="text-xs uppercase tracking-wider text-ai font-semibold">EMI Calculator</div>
            <div className="text-3xl font-bold">{formatNPR(emi)}</div>
            <div className="text-xs text-muted-foreground">per month for {term} months</div>
            <div className="h-px bg-border my-2" />
            <Row k="Approval probability" v="87%" />
            <Row k="Recommended amount" v={formatNPR(Math.round(amount * 0.92))} />
            <Row k="Interest rate" v="14% p.a." />
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
