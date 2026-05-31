import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true, index: true },
  role:     { type: String, enum: ["user","assistant"], required: true },
  content:  { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("ChatMessage", chatSchema);
