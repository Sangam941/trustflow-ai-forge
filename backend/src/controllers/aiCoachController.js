import ChatMessage from "../models/ChatMessage.js";
import Merchant from "../models/Merchant.js";
import AiInsight from "../models/AiInsight.js";

export async function getMessages(req, res) {
  try {
    const merchant = await Merchant.findOne({ user: req.user._id });
    if (!merchant) return res.status(404).json({ error: "Merchant not found" });

    const messages = await ChatMessage.find({ merchant: merchant._id }).sort({ createdAt: 1 });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function sendMessage(req, res) {
  try {
    const merchant = await Merchant.findOne({ user: req.user._id });
    
    // Save user message
    const userMsg = new ChatMessage({
      merchant: merchant._id,
      role: "user",
      content: req.body.content
    });
    await userMsg.save();

    // AI Logic placeholder (would call OpenAI/Lovable API here)
    // For now, simple canned response
    const aiContent = "I've analyzed your request. Based on your recent financial trends, maintaining your current bill payment consistency is highly recommended.";
    
    const aiMsg = new ChatMessage({
      merchant: merchant._id,
      role: "assistant",
      content: aiContent
    });
    await aiMsg.save();

    res.json({ messages: [userMsg, aiMsg] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getInsights(req, res) {
  try {
    const merchant = await Merchant.findOne({ user: req.user._id });
    const insights = await AiInsight.find({ merchant: merchant._id }).sort({ createdAt: -1 });
    res.json({ insights });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
