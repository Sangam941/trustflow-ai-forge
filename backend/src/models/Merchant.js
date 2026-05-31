import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema({
  user:             { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  businessName:     { type: String, required: true },
  ownerName:        { type: String, required: true },
  category:         { type: String, enum: ["Grocery","Electronics","Restaurant","Pharmacy","Tailoring","Salon","Hardware","Bakery","Cafe","Textiles"] },
  location:         { type: String },
  businessAgeYears: { type: Number, min: 0 },
  monthlyIncome:    { type: Number, default: 0 },
  monthlyExpense:   { type: Number, default: 0 },
  dailyCustomers:   { type: Number, default: 0 },
  joinedAt:         { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Merchant", merchantSchema);
