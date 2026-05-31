import express from "express";
import { getEligibility, apply, listLoans, getLoan } from "../controllers/loanController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/eligibility", getEligibility);
router.post("/apply", apply);
router.get("/", listLoans);
router.get("/:id", getLoan);

export default router;
