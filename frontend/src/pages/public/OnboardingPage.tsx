import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ArrowRight, ArrowLeft, Check, Building2, Wallet } from "lucide-react";
import { toast } from "sonner";

const categories = ["Grocery", "Electronics", "Restaurant", "Pharmacy", "Tailoring", "Salon", "Hardware", "Bakery", "Cafe", "Textiles"];
const locations = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Biratnagar", "Birgunj", "Butwal", "Dharan", "Hetauda", "Janakpur"];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    document.title = "Complete your profile — Hamisathi";
  }, []);

  // Business
  const [bizName, setBizName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [location, setLocation] = useState(locations[0]);
  const [years, setYears] = useState("");

  // Financials
  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");
  const [customers, setCustomers] = useState("");
  const [avgTxn, setAvgTxn] = useState("");

  const stepLabels = ["Business Details", "Monthly Income"];

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 0) {
      if (!bizName || !years) { toast.error("Please complete all fields"); return; }
      setStep(1);
    } else {
      if (!income || !expense || !customers || !avgTxn) { toast.error("Please complete all fields"); return; }
      toast.success("Profile completed! Welcome to Hamisathi.");
      navigate("/merchant/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b bg-surface">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="size-8 rounded-lg bg-gradient-ai grid place-items-center"><Shield className="size-4 text-ai-foreground" /></div>
            Hami<span className="text-gradient-ai">sathi</span>
          </Link>
          <div className="text-xs text-muted-foreground">Step {step + 1} of {stepLabels.length}</div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.form onSubmit={next} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl rounded-2xl bg-surface border shadow-soft p-8">
          {/* Stepper */}
          <div className="flex items-center gap-2 mb-8">
            {stepLabels.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`size-9 rounded-full grid place-items-center text-xs font-semibold transition
                  ${i < step ? "bg-success text-success-foreground" : i === step ? "bg-gradient-ai text-ai-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i < step ? <Check className="size-4" /> : i + 1}
                </div>
                <div className={`text-xs font-medium ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</div>
                {i < stepLabels.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? "bg-success" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              {step === 0 ? (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-ai/10 grid place-items-center"><Building2 className="size-5 text-ai" /></div>
                    <div>
                      <h2 className="text-xl font-semibold">Tell us about your business</h2>
                      <p className="text-sm text-muted-foreground">This helps us build your trust profile.</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Business name">
                      <input value={bizName} onChange={e => setBizName(e.target.value)} required placeholder="Shrestha Store"
                        className="mt-1.5 w-full h-11 px-3 rounded-lg border bg-surface outline-none focus:ring-2 focus:ring-ai/30" />
                    </Field>
                    <Field label="Category">
                      <select value={category} onChange={e => setCategory(e.target.value)}
                        className="mt-1.5 w-full h-11 px-3 rounded-lg border bg-surface outline-none focus:ring-2 focus:ring-ai/30">
                        {categories.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                    <Field label="Location">
                      <select value={location} onChange={e => setLocation(e.target.value)}
                        className="mt-1.5 w-full h-11 px-3 rounded-lg border bg-surface outline-none focus:ring-2 focus:ring-ai/30">
                        {locations.map(l => <option key={l}>{l}</option>)}
                      </select>
                    </Field>
                    <Field label="Years in business">
                      <input value={years} onChange={e => setYears(e.target.value)} type="number" min={0} required placeholder="6"
                        className="mt-1.5 w-full h-11 px-3 rounded-lg border bg-surface outline-none focus:ring-2 focus:ring-ai/30" />
                    </Field>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-ai/10 grid place-items-center"><Wallet className="size-5 text-ai" /></div>
                    <div>
                      <h2 className="text-xl font-semibold">Your financial snapshot</h2>
                      <p className="text-sm text-muted-foreground">All amounts in Rs. Used only for credit scoring.</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Monthly income (Rs.)">
                      <input value={income} onChange={e => setIncome(e.target.value)} type="number" min={0} required placeholder="180000"
                        className="mt-1.5 w-full h-11 px-3 rounded-lg border bg-surface outline-none focus:ring-2 focus:ring-ai/30" />
                    </Field>
                    <Field label="Monthly expense (Rs.)">
                      <input value={expense} onChange={e => setExpense(e.target.value)} type="number" min={0} required placeholder="120000"
                        className="mt-1.5 w-full h-11 px-3 rounded-lg border bg-surface outline-none focus:ring-2 focus:ring-ai/30" />
                    </Field>
                    <Field label="Daily customers">
                      <input value={customers} onChange={e => setCustomers(e.target.value)} type="number" min={0} required placeholder="85"
                        className="mt-1.5 w-full h-11 px-3 rounded-lg border bg-surface outline-none focus:ring-2 focus:ring-ai/30" />
                    </Field>
                    <Field label="Avg transaction (Rs.)">
                      <input value={avgTxn} onChange={e => setAvgTxn(e.target.value)} type="number" min={0} required placeholder="450"
                        className="mt-1.5 w-full h-11 px-3 rounded-lg border bg-surface outline-none focus:ring-2 focus:ring-ai/30" />
                    </Field>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8">
            <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border bg-surface disabled:opacity-40 hover:bg-muted text-sm">
              <ArrowLeft className="size-4" /> Back
            </button>
            <button type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-ai text-ai-foreground text-sm font-medium hover:opacity-90 shadow-elegant">
              {step === stepLabels.length - 1 ? <>Finish <Check className="size-4" /></> : <>Continue <ArrowRight className="size-4" /></>}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
