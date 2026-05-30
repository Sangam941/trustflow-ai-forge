import { createFileRoute } from "@tanstack/react-router";
import { currentMerchant, formatNPR, scoreBreakdown } from "@/data/mockData";
import { Sparkles, CheckCircle2, FileText } from "lucide-react";

export const Route = createFileRoute("/merchant/loan-review")({
  head: () => ({ meta: [{ title: "Loan Review — Hamisathi" }] }),
  component: Review,
});

function Review() {
  const m = currentMerchant;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Loan Review</h1>
        <p className="text-sm text-muted-foreground">AI-assisted summary for your latest application.</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Loan Summary">
            <Grid items={[["Amount", formatNPR(m.loanAmount)], ["Term","18 months"], ["Purpose","Inventory expansion"], ["Interest","14% p.a."]]} />
          </Card>
          <Card title="Business Snapshot">
            <Grid items={[["Business", m.name], ["Owner", m.owner], ["Category", m.category], ["Location", m.location], ["Years", `${m.businessAge} yr`], ["Customers/day", String(m.dailyCustomers)]]} />
          </Card>
          <Card title="Financial Snapshot">
            <Grid items={[["Monthly income", formatNPR(m.monthlyIncome)], ["Monthly expense", formatNPR(m.monthlyExpense)], ["Net cash flow", formatNPR(m.monthlyIncome - m.monthlyExpense)], ["Trust score", String(m.trustScore)]]} />
          </Card>
          <Card title="Uploaded Documents">
            <div className="space-y-2">
              {["Business registration.pdf","Citizenship ID.jpg","Bank statement Q3.pdf","Electricity bill Oct.pdf"].map(d => (
                <div key={d} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-sm"><FileText className="size-4 text-muted-foreground" />{d}</div>
                  <CheckCircle2 className="size-4 text-success" />
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border bg-gradient-to-br from-ai/10 via-surface to-surface p-5">
            <div className="text-xs uppercase tracking-wider text-ai font-semibold">Approval Probability</div>
            <div className="text-5xl font-bold mt-2 text-gradient-ai">{m.approvalProbability}%</div>
            <div className="text-xs text-muted-foreground mt-1">Based on 5 weighted signals</div>
          </div>
          <div className="rounded-2xl border bg-surface p-5">
            <div className="flex items-center gap-2"><Sparkles className="size-4 text-ai" /><div className="text-sm font-semibold">AI Insights</div></div>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="text-muted-foreground">• Strong on-time payment record (91/100)</li>
              <li className="text-muted-foreground">• Cash flow positive 9 months running</li>
              <li className="text-muted-foreground">• Add 2 more references for +8 points</li>
            </ul>
          </div>
          <div className="rounded-2xl border bg-surface p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Recommended amount</div>
            <div className="text-2xl font-semibold mt-1">{formatNPR(Math.round(m.loanAmount * 0.9))}</div>
            <div className="text-xs text-success mt-1">Maximizes approval & EMI comfort</div>
          </div>
        </div>
      </div>
    </div>
  );
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-surface border shadow-soft p-6">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}
function Grid({ items }: { items: [string, string][] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {items.map(([k, v]) => (
        <div key={k}><div className="text-xs text-muted-foreground">{k}</div><div className="text-sm font-medium mt-1">{v}</div></div>
      ))}
    </div>
  );
}
