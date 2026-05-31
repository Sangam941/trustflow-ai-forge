import { createContext, useContext, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "./AuthContext";

export type BillStatus = "pending" | "paid" | "late";
export interface Bill {
  _id: string;
  type: "Electricity" | "Internet" | "Water" | "Mobile";
  amount: number;
  dueDate: string;
  status: BillStatus;
  paidDate?: string;
  onTime?: boolean;
}

export interface Activity {
  _id: string;
  text: string;
  delta: number;
  createdAt: string;
}

interface Ctx {
  score: number;
  riskLevel: string;
  loanTier: any;
  activities: Activity[];
  pendingBills: Bill[];
  insights: any[];
  bills: Bill[];
  loading: boolean;
  payBill: (id: string) => Promise<void>;
}

const ScoreCtx = createContext<Ctx | null>(null);

export function ScoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isMerchant = user?.role === "merchant";

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ["merchantDashboard"],
    queryFn: () => api.get("/merchant/dashboard"),
    enabled: isMerchant,
  });

  const { data: billsData, isLoading: billsLoading } = useQuery({
    queryKey: ["merchantBills"],
    queryFn: () => api.get("/bills"),
    enabled: isMerchant,
  });

  const payBillMutation = useMutation({
    mutationFn: (id: string) => api.post(`/bills/${id}/pay`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchantDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["merchantBills"] });
      queryClient.invalidateQueries({ queryKey: ["merchantCreditScore"] });
    },
  });

  const loading = dashboardLoading || billsLoading;

  const value: Ctx = {
    score: dashboardData?.trustScore || 0,
    riskLevel: dashboardData?.riskLevel || "High",
    loanTier: dashboardData?.loanTier || null,
    activities: dashboardData?.activities || [],
    pendingBills: dashboardData?.pendingBills || [],
    insights: dashboardData?.insights || [],
    bills: billsData?.bills || [],
    loading,
    payBill: async (id: string) => {
      await payBillMutation.mutateAsync(id);
    },
  };

  return <ScoreCtx.Provider value={value}>{children}</ScoreCtx.Provider>;
}

export function useScore() {
  const ctx = useContext(ScoreCtx);
  if (!ctx) throw new Error("useScore must be used within ScoreProvider");
  return ctx;
}
