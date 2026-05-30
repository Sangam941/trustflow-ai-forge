import { createFileRoute } from "@tanstack/react-router";
import { currentMerchant, formatNPR } from "@/data/mockData";


export const Route = createFileRoute("/merchant/profile")({
  head: () => ({ meta: [{ title: "Profile — Hamisathi" }] }),
  component: () => {
    const m = currentMerchant;
    return (
      <div className="space-y-6 max-w-4xl">
        <h1 className="text-2xl font-semibold">Business Profile</h1>
        <div className="rounded-2xl bg-surface border shadow-soft p-6">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-gradient-ai text-ai-foreground grid place-items-center text-xl font-semibold">{m.avatar}</div>
            <div>
              <div className="text-lg font-semibold">{m.name}</div>
              <div className="text-sm text-muted-foreground">{m.owner} · {m.location}</div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {[
              ["Category", m.category], ["Location", m.location], ["Business age", `${m.businessAge} years`],
              ["Daily customers", String(m.dailyCustomers)], ["Monthly income", formatNPR(m.monthlyIncome)], ["Monthly expense", formatNPR(m.monthlyExpense)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-muted/40 p-3">
                <div className="text-xs text-muted-foreground">{k}</div>
                <div className="text-sm font-medium mt-1">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
});
