import express from "express";
import { getMessages, sendMessage, getInsights } from "../controllers/aiCoachController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/messages", getMessages);
router.post("/messages", sendMessage);
router.get("/insights", getInsights);

export default router;
