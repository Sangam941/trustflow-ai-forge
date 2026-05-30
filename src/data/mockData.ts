// Realistic dummy data for Hamisathi

export type RiskLevel = "Low" | "Medium" | "High";
export type LoanStatus = "Pending" | "Under Review" | "Approved" | "Rejected" | "Disbursed";

export interface Merchant {
  id: string;
  name: string;
  owner: string;
  category: string;
  location: string;
  businessAge: number; // years
  trustScore: number; // 0-1000
  risk: RiskLevel;
  monthlyIncome: number;
  monthlyExpense: number;
  dailyCustomers: number;
  loanAmount: number;
  loanStatus: LoanStatus;
  approvalProbability: number;
  joinedAt: string;
  avatar: string;
}

const categories = ["Grocery", "Electronics", "Restaurant", "Pharmacy", "Tailoring", "Salon", "Hardware", "Bakery", "Cafe", "Textiles"];
const locations = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Biratnagar", "Birgunj", "Butwal", "Dharan", "Hetauda", "Janakpur"];
const firstNames = ["Aarav", "Anish", "Bina", "Deepak", "Gita", "Hari", "Ishwor", "Kabita", "Laxmi", "Manish", "Niraj", "Pooja", "Rajesh", "Sita", "Suman", "Tara", "Umesh", "Vinod", "Yamuna", "Sunita"];
const lastNames = ["Shrestha", "Adhikari", "Bhandari", "Karki", "Lama", "Magar", "Pandey", "Rai", "Sharma", "Tamang", "Thapa"];
const bizSuffix = ["Store", "Mart", "Traders", "Suppliers", "Center", "House", "Corner", "Shop"];

function rand(seed: number) {
  // Deterministic PRNG so demo is stable
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(rand(seed) * arr.length)];
}

function riskFromScore(score: number): RiskLevel {
  if (score >= 720) return "Low";
  if (score >= 580) return "Medium";
  return "High";
}

function statusFromScore(score: number, seed: number): LoanStatus {
  const r = rand(seed + 99);
  if (score >= 750) return r > 0.4 ? "Approved" : "Disbursed";
  if (score >= 620) return r > 0.5 ? "Under Review" : "Pending";
  if (score >= 500) return r > 0.6 ? "Pending" : "Under Review";
  return "Rejected";
}

export const merchants: Merchant[] = Array.from({ length: 50 }, (_, i) => {
  const seed = i + 1;
  const score = Math.round(420 + rand(seed) * 480);
  const income = Math.round(35000 + rand(seed + 1) * 280000);
  const expense = Math.round(income * (0.45 + rand(seed + 2) * 0.35));
  const fname = pick(firstNames, seed + 3);
  const lname = pick(lastNames, seed + 4);
  const category = pick(categories, seed + 5);
  return {
    id: `M${String(1000 + i)}`,
    name: `${lname} ${pick(bizSuffix, seed + 6)}`,
    owner: `${fname} ${lname}`,
    category,
    location: pick(locations, seed + 7),
    businessAge: Math.round(1 + rand(seed + 8) * 14),
    trustScore: score,
    risk: riskFromScore(score),
    monthlyIncome: income,
    monthlyExpense: expense,
    dailyCustomers: Math.round(15 + rand(seed + 9) * 180),
    loanAmount: Math.round((50000 + rand(seed + 10) * 950000) / 1000) * 1000,
    loanStatus: statusFromScore(score, seed),
    approvalProbability: Math.min(98, Math.max(8, Math.round((score / 1000) * 100 + (rand(seed + 11) - 0.5) * 12))),
    joinedAt: new Date(Date.now() - Math.floor(rand(seed + 12) * 600) * 86400000).toISOString(),
    avatar: `${fname[0]}${lname[0]}`,
  };
});

export const currentMerchant: Merchant = merchants[0];

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const financialTrend = months.map((m, i) => {
  const base = currentMerchant.monthlyIncome;
  const income = Math.round(base * (0.82 + rand(i + 20) * 0.4));
  const expense = Math.round(income * (0.48 + rand(i + 30) * 0.22));
  return { month: m, income, expense, net: income - expense };
});

export const billPayments = months.map((m, i) => ({
  month: m,
  onTime: Math.round(8 + rand(i + 40) * 6),
  late: Math.round(rand(i + 50) * 3),
  missed: Math.round(rand(i + 60) * 1.4),
}));

export const trustScoreHistory = months.map((m, i) => ({
  month: m,
  score: Math.round(580 + i * 18 + rand(i + 70) * 30),
}));

export const scoreBreakdown = [
  { name: "Financial", value: 82, fullMark: 100 },
  { name: "Bill Payment", value: 91, fullMark: 100 },
  { name: "Community Trust", value: 74, fullMark: 100 },
  { name: "Transaction", value: 78, fullMark: 100 },
  { name: "Business Stability", value: 85, fullMark: 100 },
];

export const aiInsights = [
  { type: "positive", title: "Consistent bill payments", text: "Your bill payment consistency increased your score by 12 points this month.", impact: "+12" },
  { type: "suggestion", title: "Add more references", text: "Adding 2 verified community references could increase your score by 8 points.", impact: "+8" },
  { type: "positive", title: "Stable cash flow", text: "Your net cash flow has remained positive for 9 consecutive months.", impact: "+15" },
  { type: "warning", title: "Late electricity payment", text: "One late payment in October slightly reduced your reliability factor.", impact: "-4" },
];

export const portfolioRiskByCategory = categories.slice(0, 6).map((c, i) => ({
  category: c,
  low: Math.round(20 + rand(i + 80) * 40),
  medium: Math.round(15 + rand(i + 90) * 30),
  high: Math.round(5 + rand(i + 100) * 20),
}));

export const approvalTrend = months.map((m, i) => ({
  month: m,
  approved: Math.round(40 + i * 3 + rand(i + 110) * 15),
  rejected: Math.round(20 - i * 0.4 + rand(i + 120) * 10),
}));

export const riskDistribution = [
  { name: "Low Risk", value: merchants.filter(m => m.risk === "Low").length },
  { name: "Medium Risk", value: merchants.filter(m => m.risk === "Medium").length },
  { name: "High Risk", value: merchants.filter(m => m.risk === "High").length },
];

export const adminStats = {
  totalMerchants: merchants.length,
  activeApplications: merchants.filter(m => m.loanStatus === "Pending" || m.loanStatus === "Under Review").length,
  approvedLoans: merchants.filter(m => m.loanStatus === "Approved" || m.loanStatus === "Disbursed").length,
  rejectedLoans: merchants.filter(m => m.loanStatus === "Rejected").length,
  avgTrustScore: Math.round(merchants.reduce((s, m) => s + m.trustScore, 0) / merchants.length),
  portfolioHealth: 87,
};

export function getMerchantById(id: string) {
  return merchants.find(m => m.id === id);
}

export function formatNPR(n: number) {
  return "Rs. " + n.toLocaleString("en-IN");
}
