import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { merchants, formatNPR } from "@/data/mockData";
import { Search } from "lucide-react";

export const Route = createFileRoute("/admin/merchants")({
  head: () => ({ meta: [{ title: "Merchants — TrustFund AI" }] }),
  component: MerchantsPage,
});

function badge(level: string) {
  const map: Record<string, string> = {
    Low: "bg-success/10 text-success",
    Medium: "bg-warning/10 text-warning",
    High: "bg-destructive/10 text-destructive",
    Approved: "bg-success/10 text-success",
    Disbursed: "bg-success/10 text-success",
    Rejected: "bg-destructive/10 text-destructive",
    Pending: "bg-muted text-muted-foreground",
    "Under Review": "bg-ai/10 text-ai",
  };
  return map[level] || "bg-muted text-muted-foreground";
}

function MerchantsPage() {
  const [q, setQ] = useState("");
  const [risk, setRisk] = useState<string>("All");
  const list = useMemo(() =>
    merchants.filter(m =>
      (risk === "All" || m.risk === risk) &&
      (m.name.toLowerCase().includes(q.toLowerCase()) || m.owner.toLowerCase().includes(q.toLowerCase()))
    ), [q, risk]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Merchants</h1>
        <p className="text-sm text-muted-foreground">{list.length} of {merchants.length} merchants</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search merchants…"
            className="w-full h-11 pl-9 pr-3 rounded-lg border bg-surface outline-none" />
        </div>
        <select value={risk} onChange={e => setRisk(e.target.value)}
          className="h-11 px-3 rounded-lg border bg-surface outline-none text-sm">
          {["All","Low","Medium","High"].map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      <div className="rounded-2xl bg-surface border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="text-left px-5 py-3">Merchant</th>
              <th className="text-left px-5 py-3">Trust</th>
              <th className="text-left px-5 py-3">Risk</th>
              <th className="text-left px-5 py-3">Loan</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {list.map(m => (
              <tr key={m.id} className="border-t hover:bg-muted/30 transition">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-gradient-ai text-ai-foreground grid place-items-center text-xs font-semibold">{m.avatar}</div>
                    <div>
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.owner} · {m.location}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 font-semibold">{m.trustScore}</td>
                <td className="px-5 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badge(m.risk)}`}>{m.risk}</span></td>
                <td className="px-5 py-3 text-muted-foreground">{formatNPR(m.loanAmount)}</td>
                <td className="px-5 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badge(m.loanStatus)}`}>{m.loanStatus}</span></td>
                <td className="px-5 py-3 text-right">
                  <Link to="/admin/merchant-details/$id" params={{ id: m.id }} className="text-ai text-sm font-medium hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
