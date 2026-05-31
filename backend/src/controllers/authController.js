import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Merchant from "../models/Merchant.js";

function generateToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function register(req, res) {
  try {
    const { email, password, fullName, phone, role = "merchant", businessName, ownerName } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "Email already in use" });

    user = new User({ email, fullName, phone, role });
    await user.setPassword(password);
    
    const initials = fullName.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
    user.avatarInitials = initials;
    await user.save();

    if (role === "merchant") {
      const merchant = new Merchant({
        user: user._id,
        businessName: businessName || `${fullName}'s Store`,
        ownerName: ownerName || fullName
      });
      await merchant.save();
    }

    const token = generateToken(user._id);
    res.status(201).json({ token, user: { name: user.fullName, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isValid = await user.verifyPassword(password);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({ token, user: { name: user.fullName, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function me(req, res) {
  res.json({ user: { name: req.user.fullName, email: req.user.email, role: req.user.role } });
}
