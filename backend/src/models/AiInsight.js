import mongoose from "mongoose";

const insightSchema = new mongoose.Schema({
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true, index: true },
  kind:     { type: String, enum: ["positive","suggestion","warning"], required: true },
  title:    { type: String, required: true },
  body:     { type: String, required: true },
  impact:   { type: Number },
}, { timestamps: true });

export default mongoose.model("AiInsight", insightSchema);
