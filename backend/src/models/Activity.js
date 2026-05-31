import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true, index: true },
  text:     { type: String, required: true },
  delta:    { type: Number, default: 0 },
  bill:     { type: mongoose.Schema.Types.ObjectId, ref: "Bill" },
}, { timestamps: true });

export default mongoose.model("Activity", activitySchema);
