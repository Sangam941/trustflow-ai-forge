import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email:        { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  fullName:     { type: String, required: true },
  phone:        { type: String },
  avatarInitials:{ type: String },
  role:         { type: String, enum: ["merchant", "admin"], default: "merchant" },
}, { timestamps: true });

userSchema.methods.setPassword = async function (pwd) {
  this.passwordHash = await bcrypt.hash(pwd, 10);
};

userSchema.methods.verifyPassword = function (pwd) {
  return bcrypt.compare(pwd, this.passwordHash);
};

export default mongoose.model("User", userSchema);
