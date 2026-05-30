import { createFileRoute } from "@tanstack/react-router";
import { merchants, formatNPR } from "@/data/mockData";
import { CheckCircle2, XCircle, Eye } from "lucide-react";

export const Route = createFileRoute("/admin/loan-reviews")({
  head: () => ({ meta: [{ title: "Loan Reviews — TrustFund AI" }] }),
  component: () => {
    const pending = merchants.filter(m => m.loanStatus === "Pending" || m.loanStatus === "Under Review").slice(0, 12);
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Loan Reviews</h1>
          <p className="text-sm text-muted-foreground">{pending.length} applications awaiting decision.</p>
        </div>
        <div className="space-y-3">
          {pending.map(m => (
            <div key={m.id} className="rounded-2xl bg-surface border shadow-soft p-5 flex items-center gap-4 flex-wrap">
              <div className="size-11 rounded-xl bg-gradient-ai text-ai-foreground grid place-items-center font-semibold">{m.avatar}</div>
              <div className="flex-1 min-w-48">
                <div className="font-medium">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.owner} · {m.category}</div>
              </div>
              <div className="text-sm"><div className="text-xs text-muted-foreground">Trust</div><div className="font-semibold">{m.trustScore}</div></div>
              <div className="text-sm"><div className="text-xs text-muted-foreground">Amount</div><div className="font-semibold">{formatNPR(m.loanAmount)}</div></div>
              <div className="text-sm"><div className="text-xs text-muted-foreground">Approval</div><div className="font-semibold text-ai">{m.approvalProbability}%</div></div>
              <div className="flex gap-2">
                <button className="size-9 rounded-lg bg-success/10 text-success grid place-items-center hover:bg-success/20"><CheckCircle2 className="size-4" /></button>
                <button className="size-9 rounded-lg bg-muted text-muted-foreground grid place-items-center hover:bg-muted/70"><Eye className="size-4" /></button>
                <button className="size-9 rounded-lg bg-destructive/10 text-destructive grid place-items-center hover:bg-destructive/20"><XCircle className="size-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
});
