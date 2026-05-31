// Trust score engine — produces scores on a 0–100 scale.
import type { Merchant } from "@/data/mockData";
import { financialTrend } from "@/data/mockData";
import type { Bill, Activity } from "@/context/ScoreContext";

export interface ScoreComponents {
  financial: number;        // 0-100, weight 0.30
  billPayment: number;      // 0-100, weight 0.20
  transaction: number;      // 0-100, weight 0.30
  businessStability: number;// 0-100, weight 0.20
  trustScore: number;       // 0-100 weighted total
  // sub-scores for transparency
  incomeScore: number;
  expenseScore: number;
  customerActivityScore: number;
  businessActivityScore: number;
  ageScore: number;
  revenueStabilityScore: number;
}

export const WEIGHTS = {
  financial: 0.30,
  billPayment: 0.20,
  transaction: 0.30,
  businessStability: 0.20,
} as const;

function incomeScore(income: number) {
  if (income >= 50000) return 90;
  if (income >= 20000) return 75;
  return 50;
}

function expenseScore(income: number, expense: number) {
  if (income <= 0) return 50;
  const ratio = expense / income;
  if (ratio < 0.5) return 90;
  if (ratio <= 0.8) return 70;
  return 40;
}

function customerActivityScore(dailyCustomers: number) {
  if (dailyCustomers >= 100) return 90;
  if (dailyCustomers >= 50) return 70;
  return 50;
}

function ageScore(years: number) {
  if (years >= 3) return 90;
  if (years >= 1) return 70;
  return 50;
}

function revenueStabilityScore(trend: { income: number }[]) {
  if (trend.length === 0) return 60;
  const mean = trend.reduce((s, t) => s + t.income, 0) / trend.length;
  const variance = trend.reduce((s, t) => s + (t.income - mean) ** 2, 0) / trend.length;
  const cv = mean > 0 ? Math.sqrt(variance) / mean : 1; // coefficient of variation
  if (cv < 0.12) return 90;   // Stable
  if (cv < 0.25) return 60;   // Fluctuating
  return 40;                  // Unstable
}

function businessActivityScore(trend: { income: number; expense: number }[]) {
  if (trend.length === 0) return 60;
  const positiveMonths = trend.filter(t => t.income - t.expense > 0).length;
  const ratio = positiveMonths / trend.length;
  if (ratio >= 0.83) return 90;
  if (ratio >= 0.5) return 70;
  return 50;
}

function billUtilityScore(billsOfType: Bill[], activitiesOfType: Activity[]) {
  // Base from history. No history → neutral 80.
  if (billsOfType.length === 0) return 80;
  const paid = billsOfType.filter(b => b.status === "paid");
  if (paid.length === 0) return 75;
  const onTime = paid.filter(b => b.onTime).length;
  const ratio = onTime / paid.length;
  return Math.round(50 + ratio * 45); // 50..95
}

export function computeScore(
  merchant: Merchant,
  bills: Bill[],
  activities: Activity[],
): ScoreComponents {
  // Financial
  const inc = incomeScore(merchant.monthlyIncome);
  const exp = expenseScore(merchant.monthlyIncome, merchant.monthlyExpense);
  const financial = (inc + exp) / 2;

  // Bill payment — average across 4 utilities with on-time bonus / penalty
  const types: Bill["type"][] = ["Electricity", "Water", "Internet", "Mobile"];
  const perType = types.map(t =>
    billUtilityScore(
      bills.filter(b => b.type === t),
      activities.filter(a => a.text.startsWith(t)),
    ),
  );
  let billPayment = perType.reduce((s, v) => s + v, 0) / perType.length;
  const anyLate = activities.some(a => a.delta < 0);
  const anyPaid = bills.some(b => b.status === "paid");
  const allOnTime = anyPaid && !anyLate;
  if (allOnTime) billPayment += 10;
  if (anyLate) billPayment -= 20;
  billPayment = Math.max(0, Math.min(100, billPayment));

  // Transaction
  const customerActivity = customerActivityScore(merchant.dailyCustomers);
  const businessActivity = businessActivityScore(financialTrend);
  const transaction = (customerActivity + businessActivity) / 2;

  // Business stability
  const age = ageScore(merchant.businessAge);
  const revStab = revenueStabilityScore(financialTrend);
  const businessStability = (age + revStab) / 2;

  const trustScore =
    financial * WEIGHTS.financial +
    billPayment * WEIGHTS.billPayment +
    transaction * WEIGHTS.transaction +
    businessStability * WEIGHTS.businessStability;

  return {
    financial: Math.round(financial),
    billPayment: Math.round(billPayment),
    transaction: Math.round(transaction),
    businessStability: Math.round(businessStability),
    trustScore: Math.round(trustScore),
    incomeScore: inc,
    expenseScore: exp,
    customerActivityScore: customerActivity,
    businessActivityScore: businessActivity,
    ageScore: age,
    revenueStabilityScore: revStab,
  };
}

export interface LoanTier {
  label: string;
  maxLoan: number;
  approval: number;
  approvalLabel: "HIGH" | "MEDIUM" | "LOW";
  approvalRange: string;
  incomeNote: string;
}

// Loan eligibility on the 0–100 trust scale (rescaled from the 0–850 spec).
export function getLoanTier(trustScore: number): LoanTier | null {
  if (trustScore >= 75) return { label: "Excellent", maxLoan: 150000, approval: 88, approvalLabel: "HIGH",   approvalRange: "80–95%", incomeNote: "Stable income (Rs. 50k+)" };
  if (trustScore >= 65) return { label: "Good",      maxLoan: 75000,  approval: 65, approvalLabel: "MEDIUM", approvalRange: "50–80%", incomeNote: "Moderate income (Rs. 20k–50k)" };
  if (trustScore >= 55) return { label: "Fair",      maxLoan: 40000,  approval: 35, approvalLabel: "LOW",    approvalRange: "20–50%", incomeNote: "Low / unstable income" };
  return null;
}

export const MIN_LOAN_SCORE = 55;
