import express from "express";
import { listBills, addBill, payBill, deleteBill } from "../controllers/billController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/", listBills);
router.post("/", addBill);
router.post("/:id/pay", payBill);
router.delete("/:id", deleteBill);

export default router;
