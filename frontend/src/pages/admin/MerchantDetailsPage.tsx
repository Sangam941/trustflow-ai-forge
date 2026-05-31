import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { financialTrend, billPayments, formatNPR } from "@/data/mockData";
import { TrustScoreGauge } from "@/components/TrustScoreGauge";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Legend } from "recharts";
import { ArrowLeft, CheckCircle2, XCircle, Eye, Sparkles, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function MerchantDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["adminMerchant", id],
    queryFn: () => api.get(`/admin/merchants/${id}`),
    enabled: !!id
  });

  const reviewMutation = useMutation({
    mutationFn: ({ loanId, status }: { loanId: string, status: string }) => api.patch(`/admin/loans/${loanId}/review`, { status, notes: "Admin reviewed" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMerchant", id] });
      toast.success("Loan reviewed successfully");
    }
  });

  useEffect(() => {
    document.title = "Merchant Details — Hamisathi";
  }, []);

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;

  const m = data?.merchant;
  const scores = data?.scores || [];
  const loans = data?.loans || [];
  const pendingLoan = loans.find((l: any) => l.status === "Pending" || l.status === "Under Review");

  if (!m) {
    return <div className="p-6">Merchant not found.</div>;
  }

  const latestScore = scores.length > 0 ? scores[scores.length - 1].trustScore : 0;
  const trustScoreHistory = scores.map((s: any) => ({
    month: new Date(s.computedAt).toLocaleString('default', { month: 'short' }),
    score: s.trustScore
  }));

  return (
    <div className="space-y-6">
      <Link to="/admin/merchants" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to merchants
      </Link>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-2xl bg-gradient-ai text-ai-foreground grid place-items-center text-lg font-semibold">{m.businessName?.[0] || 'M'}</div>
          <div>
            <h1 className="text-2xl font-semibold">{m.businessName}</h1>
            <p className="text-sm text-muted-foreground">{m.ownerName} · {m.category} · {m.location}</p>
          </div>
        </div>
        {pendingLoan && (
          <div className="flex gap-2">
            <button disabled={reviewMutation.isPending} onClick={() => reviewMutation.mutate({ loanId: pendingLoan._id, status: "Approved" })} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-success text-success-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"><CheckCircle2 className="size-4" /> Approve</button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border bg-surface text-sm font-medium hover:bg-muted"><Eye className="size-4" /> Review</button>
            <button disabled={reviewMutation.isPending} onClick={() => reviewMutation.mutate({ loanId: pendingLoan._id, status: "Rejected" })} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"><XCircle className="size-4" /> Reject</button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-surface border shadow-soft p-6"><TrustScoreGauge score={latestScore} max={1000} /></div>
        <div className="lg:col-span-2 rounded-2xl bg-surface border shadow-soft p-6">
          <h3 className="font-semibold">Trust Score History</h3>
          <div className="h-56 mt-3">
            <ResponsiveContainer>
              <LineChart data={trustScoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} domain={[0, 1000]} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Line dataKey="score" stroke="var(--ai)" strokeWidth={3} dot={{ r: 4, fill: "var(--ai)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {[
          ["Monthly income", formatNPR(m.monthlyIncome || 0)],
          ["Monthly expense", formatNPR(m.monthlyExpense || 0)],
          ["Loan requested", formatNPR(pendingLoan?.amountRequested || 0)],
          ["Status", pendingLoan?.status || "None"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-surface border p-4">
            <div className="text-xs text-muted-foreground">{k}</div>
            <div className="text-lg font-semibold mt-1">{v}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-surface border shadow-soft p-6">
          <h3 className="font-semibold">Financial Trend</h3>
          <div className="h-56 mt-3">
            <ResponsiveContainer>
              <LineChart data={financialTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Line dataKey="income" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                <Line dataKey="expense" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl bg-surface border shadow-soft p-6">
          <h3 className="font-semibold">Payment Consistency</h3>
          <div className="h-56 mt-3">
            <ResponsiveContainer>
              <BarChart data={billPayments}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="onTime" stackId="a" fill="var(--success)" />
                <Bar dataKey="late" stackId="a" fill="var(--warning)" />
                <Bar dataKey="missed" stackId="a" fill="var(--destructive)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-ai/10 via-surface to-surface border shadow-soft p-6">
        <div className="flex items-center gap-2"><Sparkles className="size-4 text-ai" /><h3 className="font-semibold">AI Explainability</h3></div>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-success font-semibold flex items-center gap-1"><TrendingUp className="size-3" /> Positive factors</div>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>• 91% on-time bill payments</li>
              <li>• Positive cash flow 9 months</li>
              <li>• 6 years business stability</li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-warning font-semibold flex items-center gap-1"><AlertTriangle className="size-3" /> Risk drivers</div>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>• Only 2 verified references</li>
              <li>• Single income concentration</li>
              <li>• Seasonal revenue dip in Q1</li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-ai font-semibold flex items-center gap-1"><Sparkles className="size-3" /> Recommended actions</div>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>• Approve at 90% of requested</li>
              <li>• 18-month repayment term</li>
              <li>• Require 1 additional guarantor</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
