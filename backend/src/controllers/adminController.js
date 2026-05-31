import Merchant from "../models/Merchant.js";
import LoanApplication from "../models/LoanApplication.js";
import TrustScore from "../models/TrustScore.js";

export async function getDashboardStats(req, res) {
  try {
    const merchants = await Merchant.find();
    const loans = await LoanApplication.find();
    const scores = await TrustScore.aggregate([
      { $sort: { computedAt: -1 } },
      { $group: { _id: "$merchant", trustScore: { $first: "$trustScore" } } }
    ]);

    const activeApplications = loans.filter(l => l.status === "Pending" || l.status === "Under Review").length;
    const approvedLoans = loans.filter(l => l.status === "Approved" || l.status === "Disbursed").length;
    const rejectedLoans = loans.filter(l => l.status === "Rejected").length;
    
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((s, c) => s + c.trustScore, 0) / scores.length) : 0;

    res.json({
      totalMerchants: merchants.length,
      activeApplications,
      approvedLoans,
      rejectedLoans,
      avgTrustScore: avgScore,
      portfolioHealth: 87 // Placeholder for now
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getMerchants(req, res) {
  try {
    const merchants = await Merchant.find().populate("user", "fullName email");
    res.json({ merchants });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getMerchantDetails(req, res) {
  try {
    const merchant = await Merchant.findById(req.params.id).populate("user", "fullName email");
    if (!merchant) return res.status(404).json({ error: "Merchant not found" });

    const scores = await TrustScore.find({ merchant: merchant._id }).sort({ computedAt: 1 });
    const loans = await LoanApplication.find({ merchant: merchant._id });

    res.json({ merchant, scores, loans });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getLoans(req, res) {
  try {
    const loans = await LoanApplication.find().populate("merchant", "businessName ownerName");
    res.json({ loans });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function reviewLoan(req, res) {
  try {
    const loan = await LoanApplication.findById(req.params.id);
    if (!loan) return res.status(404).json({ error: "Loan not found" });

    loan.status = req.body.status;
    loan.reviewNotes = req.body.notes;
    loan.reviewedBy = req.user._id;
    loan.reviewedAt = new Date();
    
    await loan.save();
    res.json({ loan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getPortfolio(req, res) {
  try {
    // This would typically aggregate FinancialTrend and LoanApplication
    // Returning stub structure matching frontend mock
    res.json({
      disbursed: "Rs. 14.2 Cr",
      outstanding: "Rs. 9.8 Cr",
      recoveryRate: "94.6%",
      npa: "1.8%"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getRiskAnalysis(req, res) {
  try {
    // Again, typically aggregated, returning a structure
    res.json({ success: true, message: "Risk analysis data endpoint" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
