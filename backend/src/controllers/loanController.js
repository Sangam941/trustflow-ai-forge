import LoanApplication from "../models/LoanApplication.js";
import Merchant from "../models/Merchant.js";
import TrustScore from "../models/TrustScore.js";
import { getLoanTier } from "../services/scoring.js";

export async function getEligibility(req, res) {
  try {
    const merchant = await Merchant.findOne({ user: req.user._id });
    const score = await TrustScore.findOne({ merchant: merchant._id }).sort({ computedAt: -1 });
    
    if (!score) return res.json({ eligible: false, tier: null });

    const tier = getLoanTier(score.trustScore);
    res.json({ eligible: !!tier, tier, currentScore: score.trustScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function apply(req, res) {
  try {
    const merchant = await Merchant.findOne({ user: req.user._id });
    const score = await TrustScore.findOne({ merchant: merchant._id }).sort({ computedAt: -1 });
    const tier = getLoanTier(score ? score.trustScore : 0);

    const application = new LoanApplication({
      merchant: merchant._id,
      amountRequested: req.body.amountRequested,
      purpose: req.body.purpose,
      termMonths: req.body.termMonths || 12,
      trustScoreAtApply: score ? score.trustScore : null,
      approvalTier: tier ? tier.approvalLabel : null,
      approvalProbability: tier ? tier.approval : null,
      status: "Pending"
    });

    await application.save();
    res.status(201).json({ application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function listLoans(req, res) {
  try {
    const merchant = await Merchant.findOne({ user: req.user._id });
    const loans = await LoanApplication.find({ merchant: merchant._id }).sort({ createdAt: -1 });
    res.json({ loans });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getLoan(req, res) {
  try {
    const merchant = await Merchant.findOne({ user: req.user._id });
    const loan = await LoanApplication.findOne({ _id: req.params.id, merchant: merchant._id });
    if (!loan) return res.status(404).json({ error: "Loan not found" });
    res.json({ loan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
