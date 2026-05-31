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
