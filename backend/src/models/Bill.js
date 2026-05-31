import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true, index: true },
  type:     { type: String, enum: ["Electricity","Water","Internet","Mobile"], required: true },
  amount:   { type: Number, required: true },
  dueDate:  { type: Date, required: true },
  status:   { type: String, enum: ["pending","paid","late"], default: "pending" },
  paidDate: { type: Date },
  onTime:   { type: Boolean },
}, { timestamps: true });

billSchema.index({ merchant: 1, dueDate: 1 });
export default mongoose.model("Bill", billSchema);
