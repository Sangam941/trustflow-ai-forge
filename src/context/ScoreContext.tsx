import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { currentMerchant } from "@/data/mockData";

export type BillStatus = "pending" | "paid" | "late";
export interface Bill {
  id: string;
  type: "Electricity" | "Internet" | "Water" | "Mobile";
  amount: number;
  dueDate: string; // YYYY-MM-DD
  status: BillStatus;
  paidDate?: string;
  onTime?: boolean;
}

export interface Activity {
  id: string;
  text: string;
  delta: number; // +15, -10, 0
  at: string;
}

const initialBills: Bill[] = [
  { id: "b1", type: "Electricity", amount: 1200, dueDate: "2026-06-05", status: "pending" },
  { id: "b2", type: "Internet", amount: 900, dueDate: "2026-06-10", status: "pending" },
  { id: "b3", type: "Water", amount: 450, dueDate: "2026-05-28", status: "pending" },
  { id: "b4", type: "Mobile", amount: 650, dueDate: "2026-06-15", status: "pending" },
];

interface Ctx {
  baseScore: number;
  score: number;
  delta: number;
  bills: Bill[];
  activities: Activity[];
  payBill: (id: string) => { delta: number; onTime: boolean } | null;
}

const ScoreCtx = createContext<Ctx | null>(null);

export function ScoreProvider({ children }: { children: ReactNode }) {
  const baseScore = currentMerchant.trustScore;
  const [delta, setDelta] = useState(0);
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [activities, setActivities] = useState<Activity[]>([]);

  const payBill = (id: string) => {
    const bill = bills.find(b => b.id === id);
    if (!bill || bill.status === "paid") return null;
    const today = new Date();
    const due = new Date(bill.dueDate);
    const onTime = today <= due;
    const change = onTime ? 15 : -10;
    const paidDate = today.toISOString().split("T")[0];

    setBills(prev => prev.map(b => b.id === id ? { ...b, status: "paid", paidDate, onTime } : b));
    setDelta(d => Math.max(-baseScore, Math.min(1000 - baseScore, d + change)));
    setActivities(prev => [
      { id: crypto.randomUUID(), text: `${bill.type} bill paid ${onTime ? "on time" : "late"}`, delta: change, at: today.toISOString() },
      ...prev,
    ]);
    return { delta: change, onTime };
  };

  const score = Math.max(0, Math.min(1000, baseScore + delta));

  const value = useMemo(() => ({ baseScore, score, delta, bills, activities, payBill }), [baseScore, score, delta, bills, activities]);
  return <ScoreCtx.Provider value={value}>{children}</ScoreCtx.Provider>;
}

export function useScore() {
  const ctx = useContext(ScoreCtx);
  if (!ctx) throw new Error("useScore must be used within ScoreProvider");
  return ctx;
}
