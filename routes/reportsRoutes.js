import express from "express";
import Sale from "../models/Sale.js";
import CreditSale from "../models/CreditSale.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/roles.js";

const router = express.Router();

router.get("/summary", protect, authorize("director"), async (req, res) => {
  const sales = await Sale.aggregate([
    {
      $group: {
        _id: "$branch",
        totalRevenue: { $sum: "$amountPaid" }
      }
    }
  ]);

  const credit = await CreditSale.aggregate([
    {
      $group: {
        _id: "$branch",
        totalCreditOutstanding: { $sum: "$amountDue" }
      }
    }
  ]);

  res.json({ sales, credit });
});

export default router;
