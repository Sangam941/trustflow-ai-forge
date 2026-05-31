import express from "express";
import { getDashboardStats, getMerchants, getMerchantDetails, getLoans, reviewLoan, getPortfolio, getRiskAnalysis } from "../controllers/adminController.js";
import { auth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

router.use(auth, requireAdmin);

router.get("/dashboard", getDashboardStats);
router.get("/merchants", getMerchants);
router.get("/merchants/:id", getMerchantDetails);
router.get("/loans", getLoans);
router.patch("/loans/:id/review", reviewLoan);
router.get("/portfolio", getPortfolio);
router.get("/risk-analysis", getRiskAnalysis);

export default router;
