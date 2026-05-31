import express from "express";
import { getProfile, updateProfile, onboarding, getDashboard, getCreditScore, getActivities, getFinancialTrend } from "../controllers/merchantController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/onboarding", onboarding);
router.get("/dashboard", getDashboard);
router.get("/credit-score", getCreditScore);
router.get("/activities", getActivities);
router.get("/financial-trend", getFinancialTrend);

export default router;
