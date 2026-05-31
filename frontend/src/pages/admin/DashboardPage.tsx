import { useEffect } from "react";
import { StatCard } from "@/components/StatCard";
import { approvalTrend, riskDistribution, portfolioRiskByCategory } from "@/data/mockData";
import { Users, FileCheck2, FileX2, Activity, Gauge, ShieldCheck, Loader2 } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const PIE_COLORS = ["var(--chart-2)", "var(--chart-1)", "var(--chart-5)"];

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: () => api.get("/admin/dashboard")
  });

  useEffect(() => {
    document.title = "Admin Dashboard — Hamisathi";
  }, []);

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;
  }

  const stats = data || {
    totalMerchants: 0, activeApplications: 0, approvedLoans: 0, rejectedLoans: 0, avgTrustScore: 0, portfolioHealth: 0
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Risk Intelligence Overview</h1>
        <p className="text-sm text-muted-foreground">Real-time portfolio and lending performance.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard index={0} label="Merchants" value={stats.totalMerchants} delta={8} icon={<Users className="size-5" />} />
        <StatCard index={1} label="Active" value={stats.activeApplications} delta={4} icon={<Activity className="size-5" />} accent="ai" />
        <StatCard index={2} label="Approved" value={stats.approvedLoans} delta={12} icon={<FileCheck2 className="size-5" />} accent="success" />
        <StatCard index={3} label="Rejected" value={stats.rejectedLoans} delta={-3} icon={<FileX2 className="size-5" />} accent="warning" />
        <StatCard index={4} label="Avg Trust" value={stats.avgTrustScore} delta={2} icon={<Gauge className="size-5" />} accent="ai" />
        <StatCard index={5} label="Portfolio Health" value={`${stats.portfolioHealth}%`} delta={3} icon={<ShieldCheck className="size-5" />} accent="success" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-surface p-6 border shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Loan Approval Trends</h3>
              <p className="text-xs text-muted-foreground">Last 12 months</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-chart-2" /> Approved</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-chart-5" /> Rejected</span>
            </div>
          </div>
          <div className="h-72 mt-4">
            <ResponsiveContainer>
              <AreaChart data={approvalTrend}>
                <defs>
                  <linearGradient id="ap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.35} /><stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="rj" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-5)" stopOpacity={0.3} /><stop offset="100%" stopColor="var(--chart-5)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area dataKey="approved" stroke="var(--chart-2)" strokeWidth={2} fill="url(#ap)" />
                <Area dataKey="rejected" stroke="var(--chart-5)" strokeWidth={2} fill="url(#rj)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-surface p-6 border shadow-soft">
          <h3 className="font-semibold">Risk Distribution</h3>
          <p className="text-xs text-muted-foreground">{stats.totalMerchants} merchants</p>
          <div className="h-72 mt-2">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={riskDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={4}>
                  {riskDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-surface p-6 border shadow-soft">
        <h3 className="font-semibold">Portfolio Risk by Category</h3>
        <p className="text-xs text-muted-foreground">Risk stratification across business categories</p>
        <div className="h-72 mt-3">
          <ResponsiveContainer>
            <BarChart data={portfolioRiskByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="category" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="low" stackId="r" fill="var(--success)" radius={[0,0,0,0]} />
              <Bar dataKey="medium" stackId="r" fill="var(--warning)" />
              <Bar dataKey="high" stackId="r" fill="var(--destructive)" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
