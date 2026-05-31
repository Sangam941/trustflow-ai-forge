import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const formatNPR = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(amount);

export default function ProfilePage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["merchantProfile"],
    queryFn: () => api.get("/merchant/profile")
  });

  useEffect(() => {
    document.title = "Profile — Hamisathi";
  }, []);

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;
  }

  const m = data?.merchant;
  const avatarInitials = user?.name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "M";

  if (!m) {
    return <div className="p-6">Profile not found. Please complete onboarding.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-semibold">Business Profile</h1>
      <div className="rounded-2xl bg-surface border shadow-soft p-6">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-2xl bg-gradient-ai text-ai-foreground grid place-items-center text-xl font-semibold">{avatarInitials}</div>
          <div>
            <div className="text-lg font-semibold">{m.businessName}</div>
            <div className="text-sm text-muted-foreground">{m.ownerName} · {m.location}</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          {[
            ["Category", m.category], ["Location", m.location], ["Business age", `${m.businessAgeYears} years`],
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
}
