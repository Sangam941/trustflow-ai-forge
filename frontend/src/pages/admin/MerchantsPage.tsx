import { Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

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

export default function MerchantsPage() {
  const [q, setQ] = useState("");
  const [risk, setRisk] = useState<string>("All");

  const { data, isLoading } = useQuery({
    queryKey: ["adminMerchants"],
    queryFn: () => api.get("/admin/merchants")
  });

  useEffect(() => {
    document.title = "Merchants — Hamisathi";
  }, []);

  const merchants = data?.merchants || [];

  const list = useMemo(() =>
    merchants.filter((m: any) =>
      (risk === "All" || (m.riskLevel || "Medium") === risk) &&
      ((m.businessName || "").toLowerCase().includes(q.toLowerCase()) || (m.ownerName || "").toLowerCase().includes(q.toLowerCase()))
    ), [q, risk, merchants]);

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;

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
              <th className="text-left px-5 py-3">Risk</th>
              <th className="text-left px-5 py-3">Category</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((m: any) => (
              <tr key={m._id} className="border-t hover:bg-muted/30 transition">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-gradient-ai text-ai-foreground grid place-items-center text-xs font-semibold">{m.businessName?.[0] || 'M'}</div>
                    <div>
                      <div className="font-medium">{m.businessName}</div>
                      <div className="text-xs text-muted-foreground">{m.ownerName} · {m.location}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badge(m.riskLevel || "Medium")}`}>{m.riskLevel || "Medium"}</span></td>
                <td className="px-5 py-3 text-muted-foreground">{m.category}</td>
                <td className="px-5 py-3 text-right">
                  <Link to={`/admin/merchant-details/${m._id}`} className="text-ai text-sm font-medium hover:underline">View</Link>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
               <tr>
                 <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">No merchants found.</td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
