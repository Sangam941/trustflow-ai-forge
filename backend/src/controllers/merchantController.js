import Merchant from "../models/Merchant.js";
import TrustScore from "../models/TrustScore.js";
import Activity from "../models/Activity.js";
import FinancialTrend from "../models/FinancialTrend.js";
import Bill from "../models/Bill.js";
import AiInsight from "../models/AiInsight.js";
import { computeTrustScore, getLoanTier } from "../services/scoring.js";

export async function getProfile(req, res) {
  try {
    const merchant = await Merchant.findOne({ user: req.user._id });
    if (!merchant) return res.status(404).json({ error: "Merchant profile not found" });
    
    const latestScore = await TrustScore.findOne({ merchant: merchant._id }).sort({ computedAt: -1 });
    res.json({ merchant, latestScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateProfile(req, res) {
  try {
    const merchant = await Merchant.findOneAndUpdate({ user: req.user._id }, req.body, { new: true });
    res.json({ merchant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function onboarding(req, res) {
  try {
    const data = req.body;
    const merchant = await Merchant.findOneAndUpdate(
      { user: req.user._id },
      { 
        category: data.category,
        location: data.location,
        businessAgeYears: data.businessAgeYears,
        monthlyIncome: data.monthlyIncome,
        monthlyExpense: data.monthlyExpense,
        dailyCustomers: data.dailyCustomers,
      },
      { new: true }
    );
    
    // Create initial score
    const initialScore = new TrustScore({
      merchant: merchant._id,
      trustScore: 450, // Starting score
    });
    await initialScore.save();

    res.json({ merchant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getDashboard(req, res) {
  try {
    const merchant = await Merchant.findOne({ user: req.user._id });
    if (!merchant) return res.status(404).json({ error: "Merchant not found" });

    const score = await TrustScore.findOne({ merchant: merchant._id }).sort({ computedAt: -1 });
    const activities = await Activity.find({ merchant: merchant._id }).sort({ createdAt: -1 }).limit(5);
    const bills = await Bill.find({ merchant: merchant._id, status: "pending" }).sort({ dueDate: 1 });
    const insights = await AiInsight.find({ merchant: merchant._id }).sort({ createdAt: -1 }).limit(4);
    
    const currentScore = score ? score.trustScore : 450;
    
    res.json({
      trustScore: currentScore,
      riskLevel: currentScore >= 72 ? "Low" : currentScore >= 58 ? "Medium" : "High",
      loanTier: getLoanTier(currentScore),
      activities,
      pendingBills: bills,
      insights
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getCreditScore(req, res) {
  try {
    const merchant = await Merchant.findOne({ user: req.user._id });
    if (!merchant) return res.status(404).json({ error: "Merchant not found" });

    const scores = await TrustScore.find({ merchant: merchant._id }).sort({ computedAt: 1 });
    const latest = scores.length > 0 ? scores[scores.length - 1] : null;
    
    res.json({ history: scores, latest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getActivities(req, res) {
  try {
    const merchant = await Merchant.findOne({ user: req.user._id });
    const activities = await Activity.find({ merchant: merchant._id }).sort({ createdAt: -1 });
    res.json({ activities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getFinancialTrend(req, res) {
  try {
    const merchant = await Merchant.findOne({ user: req.user._id });
    const trend = await FinancialTrend.find({ merchant: merchant._id }).sort({ month: 1 });
    res.json({ trend });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
