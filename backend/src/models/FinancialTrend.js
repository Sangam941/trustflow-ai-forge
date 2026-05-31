import mongoose from "mongoose";

const financialTrendSchema = new mongoose.Schema({
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true },
  month:    { type: Date, required: true },  // first day of month
  income:   { type: Number, required: true },
  expense:  { type: Number, required: true },
});

financialTrendSchema.index({ merchant: 1, month: 1 }, { unique: true });
export default mongoose.model("FinancialTrend", financialTrendSchema);
