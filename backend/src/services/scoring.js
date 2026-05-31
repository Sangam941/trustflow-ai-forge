export const WEIGHTS = { financial: 0.30, billPayment: 0.20, transaction: 0.30, businessStability: 0.20 };

const incomeScore  = (i) => i >= 50000 ? 90 : i >= 20000 ? 75 : 50;
const expenseScore = (i, e) => { 
  if (i <= 0) return 50;
  const r = e/i; 
  return r < 0.5 ? 90 : r <= 0.8 ? 70 : 40; 
};
const customerScore= (c) => c >= 100 ? 90 : c >= 50 ? 70 : 50;
const ageScore     = (y) => y >= 3 ? 90 : y >= 1 ? 70 : 50;

function revenueStabilityScore(trend) {
  if (trend.length === 0) return 60;
  const mean = trend.reduce((s, t) => s + t.income, 0) / trend.length;
  const variance = trend.reduce((s, t) => s + (t.income - mean) ** 2, 0) / trend.length;
  const cv = mean > 0 ? Math.sqrt(variance) / mean : 1;
  if (cv < 0.12) return 90;
  if (cv < 0.25) return 60;
  return 40;
}

function businessActivityScore(trend) {
  if (trend.length === 0) return 60;
  const positiveMonths = trend.filter(t => t.income - t.expense > 0).length;
  const ratio = positiveMonths / trend.length;
  if (ratio >= 0.83) return 90;
  if (ratio >= 0.5) return 70;
  return 50;
}

function billUtilityScore(billsOfType, activitiesOfType) {
  if (billsOfType.length === 0) return 80;
  const paid = billsOfType.filter(b => b.status === "paid");
  if (paid.length === 0) return 75;
  const onTime = paid.filter(b => b.onTime).length;
  const ratio = onTime / paid.length;
  return Math.round(50 + ratio * 45);
}

export function computeTrustScore({ merchant, bills, activities, trend }) {
  const inc = incomeScore(merchant.monthlyIncome);
  const exp = expenseScore(merchant.monthlyIncome, merchant.monthlyExpense);
  const financial = (inc + exp) / 2;

  const types = ["Electricity", "Water", "Internet", "Mobile"];
  const perType = types.map(t =>
    billUtilityScore(
      bills.filter(b => b.type === t),
      activities.filter(a => a.text.startsWith(t)),
    )
  );
  let billPayment = perType.reduce((s, v) => s + v, 0) / perType.length;
  const anyLate = activities.some(a => a.delta < 0);
  const anyPaid = bills.some(b => b.status === "paid");
  const allOnTime = anyPaid && !anyLate;
  if (allOnTime) billPayment += 10;
  if (anyLate) billPayment -= 20;
  billPayment = Math.max(0, Math.min(100, billPayment));

  const customerActivity = customerScore(merchant.dailyCustomers);
  const businessActivity = businessActivityScore(trend);
  const transaction = (customerActivity + businessActivity) / 2;

  const age = ageScore(merchant.businessAgeYears);
  const revStab = revenueStabilityScore(trend);
  const businessStability = (age + revStab) / 2;

  const trustScore = Math.round(
    financial * WEIGHTS.financial +
    billPayment * WEIGHTS.billPayment +
    transaction * WEIGHTS.transaction +
    businessStability * WEIGHTS.businessStability
  );

  return { 
    trustScore, 
    financialScore: Math.round(financial), 
    billPaymentScore: Math.round(billPayment), 
    transactionScore: Math.round(transaction), 
    businessStabilityScore: Math.round(businessStability),
    incomeScore: inc,
    expenseScore: exp,
    customerActivityScore: customerActivity,
    businessActivityScore: businessActivity,
    ageScore: age,
    revenueStabilityScore: revStab
  };
}

export function getLoanTier(score) {
  if (score >= 75) return { label: "Excellent", maxLoan: 150000, approval: 88, approvalLabel: "HIGH", approvalRange: "80–95%", incomeNote: "Stable income (Rs. 50k+)" };
  if (score >= 65) return { label: "Good", maxLoan: 75000, approval: 65, approvalLabel: "MEDIUM", approvalRange: "50–80%", incomeNote: "Moderate income (Rs. 20k–50k)" };
  if (score >= 55) return { label: "Fair", maxLoan: 40000, approval: 35, approvalLabel: "LOW", approvalRange: "20–50%", incomeNote: "Low / unstable income" };
  return null;
}
