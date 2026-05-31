# Hamisathi — Backend Models & Routes (Express + Node.js)

Reference for building a Node.js/Express backend for the Hamisathi prototype.
Stack assumption: **Node.js + Express + MongoDB (Mongoose)** + JWT auth.
(If you prefer Postgres + Sequelize/Prisma, the field shapes map 1:1.)

Trust scores are stored on the **0–100 scale** matching `src/lib/scoring.ts`.

---

## Project structure

```
backend/
├── src/
│   ├── server.js
│   ├── config/db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Merchant.js
│   │   ├── Bill.js
│   │   ├── Activity.js
│   │   ├── TrustScore.js
│   │   ├── FinancialTrend.js
│   │   ├── LoanApplication.js
│   │   ├── AiInsight.js
│   │   └── ChatMessage.js
│   ├── middleware/
│   │   ├── auth.js          // verify JWT
│   │   └── requireAdmin.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── merchantController.js
│   │   ├── billController.js
│   │   ├── loanController.js
│   │   ├── adminController.js
│   │   └── aiCoachController.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── merchant.routes.js
│   │   ├── bill.routes.js
│   │   ├── loan.routes.js
│   │   ├── admin.routes.js
│   │   └── aiCoach.routes.js
│   └── services/
│       └── scoring.js       // port of src/lib/scoring.ts
└── package.json
```

---

## 1. `User` model

```js
// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email:        { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  fullName:     { type: String, required: true },
  phone:        { type: String },
  avatarInitials:{ type: String },
  role:         { type: String, enum: ["merchant", "admin"], default: "merchant" },
}, { timestamps: true });

userSchema.methods.setPassword = async function (pwd) {
  this.passwordHash = await bcrypt.hash(pwd, 10);
};
userSchema.methods.verifyPassword = function (pwd) {
  return bcrypt.compare(pwd, this.passwordHash);
};

export default mongoose.model("User", userSchema);
```

---

## 2. `Merchant` model

```js
// models/Merchant.js
import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema({
  user:             { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  businessName:     { type: String, required: true },
  ownerName:        { type: String, required: true },
  category:         { type: String, enum: ["Grocery","Electronics","Restaurant","Pharmacy","Tailoring","Salon","Hardware","Bakery","Cafe","Textiles"] },
  location:         { type: String },
  businessAgeYears: { type: Number, min: 0 },
  monthlyIncome:    { type: Number, default: 0 },
  monthlyExpense:   { type: Number, default: 0 },
  dailyCustomers:   { type: Number, default: 0 },
  joinedAt:         { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Merchant", merchantSchema);
```

---

## 3. `Bill` model

```js
// models/Bill.js
import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true, index: true },
  type:     { type: String, enum: ["Electricity","Water","Internet","Mobile"], required: true },
  amount:   { type: Number, required: true },
  dueDate:  { type: Date, required: true },
  status:   { type: String, enum: ["pending","paid","late"], default: "pending" },
  paidDate: { type: Date },
  onTime:   { type: Boolean },
}, { timestamps: true });

billSchema.index({ merchant: 1, dueDate: 1 });
export default mongoose.model("Bill", billSchema);
```

---

## 4. `Activity` model

```js
// models/Activity.js
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true, index: true },
  text:     { type: String, required: true },
  delta:    { type: Number, default: 0 },   // +2 / -3
  bill:     { type: mongoose.Schema.Types.ObjectId, ref: "Bill" },
}, { timestamps: true });

export default mongoose.model("Activity", activitySchema);
```

---

## 5. `TrustScore` model (history snapshots)

```js
// models/TrustScore.js
import mongoose from "mongoose";

const trustScoreSchema = new mongoose.Schema({
  merchant:               { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true, index: true },
  trustScore:             { type: Number, min: 0, max: 100, required: true },
  financialScore:         { type: Number, min: 0, max: 100 },
  billPaymentScore:       { type: Number, min: 0, max: 100 },
  transactionScore:       { type: Number, min: 0, max: 100 },
  businessStabilityScore: { type: Number, min: 0, max: 100 },
  computedAt:             { type: Date, default: Date.now },
});

trustScoreSchema.index({ merchant: 1, computedAt: -1 });
export default mongoose.model("TrustScore", trustScoreSchema);
```

---

## 6. `FinancialTrend` model

```js
// models/FinancialTrend.js
import mongoose from "mongoose";

const financialTrendSchema = new mongoose.Schema({
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true },
  month:    { type: Date, required: true },  // first day of month
  income:   { type: Number, required: true },
  expense:  { type: Number, required: true },
});

financialTrendSchema.index({ merchant: 1, month: 1 }, { unique: true });
export default mongoose.model("FinancialTrend", financialTrendSchema);
```

---

## 7. `LoanApplication` model

```js
// models/LoanApplication.js
import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
  merchant:           { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true, index: true },
  amountRequested:    { type: Number, required: true },
  purpose:            { type: String },
  termMonths:         { type: Number, default: 12 },
  trustScoreAtApply:  { type: Number, min: 0, max: 100 },
  approvalTier:       { type: String, enum: ["HIGH","MEDIUM","LOW"] },
  approvalProbability:{ type: Number, min: 0, max: 100 },
  status:             { type: String, enum: ["Pending","Under Review","Approved","Rejected","Disbursed"], default: "Pending" },
  reviewedBy:         { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewNotes:        { type: String },
  reviewedAt:         { type: Date },
}, { timestamps: true });

export default mongoose.model("LoanApplication", loanSchema);
```

---

## 8. `AiInsight` model

```js
// models/AiInsight.js
import mongoose from "mongoose";

const insightSchema = new mongoose.Schema({
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true, index: true },
  kind:     { type: String, enum: ["positive","suggestion","warning"], required: true },
  title:    { type: String, required: true },
  body:     { type: String, required: true },
  impact:   { type: Number },   // e.g. +12 / -4
}, { timestamps: true });

export default mongoose.model("AiInsight", insightSchema);
```

---

## 9. `ChatMessage` model (AI Coach)

```js
// models/ChatMessage.js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true, index: true },
  role:     { type: String, enum: ["user","assistant"], required: true },
  content:  { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("ChatMessage", chatSchema);
```

---

## Auth middleware

```js
// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.sub);
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// middleware/requireAdmin.js
export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  next();
}
```

---

## Express routes

### `routes/auth.routes.js`
```
POST   /api/auth/register      → create User + Merchant profile, return JWT
POST   /api/auth/login         → email + password, return JWT
POST   /api/auth/logout        → optional (client-side discard)
GET    /api/auth/me            → current user + role
```

### `routes/merchant.routes.js`  (auth required)
```
GET    /api/merchant/profile             → merchant + latest trust score
PUT    /api/merchant/profile             → update business info
POST   /api/merchant/onboarding          → complete onboarding fields
GET    /api/merchant/dashboard           → score, delta, recent activities, pending bills
GET    /api/merchant/credit-score        → components + last 12 snapshots
GET    /api/merchant/activities          → activity log
GET    /api/merchant/financial-trend     → monthly income/expense series
```

### `routes/bill.routes.js`  (auth required)
```
GET    /api/bills                        → list merchant bills
POST   /api/bills                        → add bill (Electricity/Water/...)
POST   /api/bills/:id/pay                → mark paid, log activity, recompute score
DELETE /api/bills/:id
```

### `routes/loan.routes.js`  (auth required)
```
GET    /api/loans/eligibility            → tier from latest trust score
POST   /api/loans/apply                  → create LoanApplication
GET    /api/loans                        → merchant's own applications
GET    /api/loans/:id
```

### `routes/admin.routes.js`  (auth + admin)
```
GET    /api/admin/dashboard              → KPI stats (totals, avg score, portfolio health)
GET    /api/admin/merchants              → list with filters (risk, status, search)
GET    /api/admin/merchants/:id          → full merchant details + charts
GET    /api/admin/loans                  → all applications
PATCH  /api/admin/loans/:id/review       → { status, notes } → updates application
GET    /api/admin/portfolio              → risk distribution, approval trend
GET    /api/admin/risk-analysis          → risk-by-category aggregations
```

### `routes/aiCoach.routes.js`  (auth required)
```
GET    /api/ai-coach/messages            → chat history
POST   /api/ai-coach/messages            → send user message, stream AI reply
GET    /api/ai-coach/insights            → cached AI insights for merchant
```

---

## `server.js` wiring

```js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import merchantRoutes from "./routes/merchant.routes.js";
import billRoutes from "./routes/bill.routes.js";
import loanRoutes from "./routes/loan.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import aiCoachRoutes from "./routes/aiCoach.routes.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/merchant", merchantRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai-coach", aiCoachRoutes);

await mongoose.connect(process.env.MONGO_URI);
app.listen(process.env.PORT || 4000);
```

---

## Scoring service (port of `src/lib/scoring.ts`)

```js
// services/scoring.js
export const WEIGHTS = { financial: 0.30, billPayment: 0.20, transaction: 0.30, businessStability: 0.20 };

const incomeScore  = (i) => i >= 50000 ? 90 : i >= 20000 ? 75 : 50;
const expenseScore = (i, e) => { const r = e/i; return r < 0.5 ? 90 : r <= 0.8 ? 70 : 40; };
const customerScore= (c) => c >= 100 ? 90 : c >= 50 ? 70 : 50;
const ageScore     = (y) => y >= 3 ? 90 : y >= 1 ? 70 : 50;

export function computeTrustScore({ merchant, bills, activities, trend }) {
  const financial = (incomeScore(merchant.monthlyIncome) + expenseScore(merchant.monthlyIncome, merchant.monthlyExpense)) / 2;
  // ... bill, transaction, stability (same formulas as src/lib/scoring.ts)
  const transaction = customerScore(merchant.dailyCustomers); // + business activity
  const businessStability = ageScore(merchant.businessAgeYears);
  const billPayment = computeBillScore(bills, activities);

  const trustScore = Math.round(
    financial * 0.30 + billPayment * 0.20 + transaction * 0.30 + businessStability * 0.20
  );
  return { trustScore, financial, billPayment, transaction, businessStability };
}

export function getLoanTier(score) {
  if (score >= 75) return { tier: "HIGH",   maxLoan: 150000, approval: "80–95%" };
  if (score >= 65) return { tier: "MEDIUM", maxLoan: 75000,  approval: "50–80%" };
  if (score >= 55) return { tier: "LOW",    maxLoan: 40000,  approval: "20–50%" };
  return null;
}
```

---

## Trust-score / loan eligibility table (0–100)

| Trust Score | Tier   | Max Loan (Rs.) | Approval |
|-------------|--------|----------------|----------|
| ≥ 75        | HIGH   | 150,000        | 80–95%   |
| 65–74       | MEDIUM | 75,000         | 50–80%   |
| 55–64       | LOW    | 40,000         | 20–50%   |
| < 55        | —      | Locked         | —        |

---

## Required env vars (`.env`)

```
PORT=4000
MONGO_URI=mongodb+srv://...
JWT_SECRET=replace-me
CLIENT_URL=http://localhost:5173
LOVABLE_API_KEY=...    # for AI Coach
```
