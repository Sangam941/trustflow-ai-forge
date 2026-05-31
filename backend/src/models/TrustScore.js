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
