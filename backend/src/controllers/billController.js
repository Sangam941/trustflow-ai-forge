import Bill from "../models/Bill.js";
import Merchant from "../models/Merchant.js";
import Activity from "../models/Activity.js";
import TrustScore from "../models/TrustScore.js";
import FinancialTrend from "../models/FinancialTrend.js";
import { computeTrustScore } from "../services/scoring.js";

export async function listBills(req, res) {
  try {
    const merchant = await Merchant.findOne({ user: req.user._id });
    const bills = await Bill.find({ merchant: merchant._id }).sort({ dueDate: 1 });
    res.json({ bills });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function addBill(req, res) {
  try {
    const merchant = await Merchant.findOne({ user: req.user._id });
    const bill = new Bill({ ...req.body, merchant: merchant._id });
    await bill.save();
    res.status(201).json({ bill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function payBill(req, res) {
  try {
    const merchant = await Merchant.findOne({ user: req.user._id });
    const bill = await Bill.findOne({ _id: req.params.id, merchant: merchant._id });
    if (!bill) return res.status(404).json({ error: "Bill not found" });
    if (bill.status === "paid") return res.status(400).json({ error: "Bill already paid" });

    const today = new Date();
    const onTime = today <= bill.dueDate;
    
    bill.status = "paid";
    bill.paidDate = today;
    bill.onTime = onTime;
    await bill.save();

    const delta = onTime ? 2 : -3;
    const activity = new Activity({
      merchant: merchant._id,
      text: `${bill.type} bill paid ${onTime ? "on time" : "late"}`,
      delta,
      bill: bill._id
    });
    await activity.save();

    // Recompute score
    const allBills = await Bill.find({ merchant: merchant._id });
    const activities = await Activity.find({ merchant: merchant._id });
    const trend = await FinancialTrend.find({ merchant: merchant._id });
    
    const newScoreData = computeTrustScore({ merchant, bills: allBills, activities, trend });
    const newScore = new TrustScore({
      merchant: merchant._id,
      ...newScoreData
    });
    await newScore.save();

    res.json({ bill, activity, newScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteBill(req, res) {
  try {
    const merchant = await Merchant.findOne({ user: req.user._id });
    await Bill.findOneAndDelete({ _id: req.params.id, merchant: merchant._id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
