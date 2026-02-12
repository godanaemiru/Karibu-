import express from "express";
import Sale from "../models/Sale.js";
import Produce from "../models/Produce.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/roles.js";

const router = express.Router();

router.post("/", protect, authorize("agent", "manager"), async (req, res) => {
  const { produceName, tonnage, amountPaid, buyerName } = req.body;

  const produce = await Produce.findOne({
    name: produceName,
    branch: req.user.branch
  });

  if (!produce || produce.quantityInStock < tonnage)
    return res.status(400).json({ message: "Out of stock" });

  produce.quantityInStock -= tonnage;
  await produce.save();

  const sale = await Sale.create({
    produceName,
    branch: req.user.branch,
    tonnage,
    amountPaid,
    buyerName,
    agentName: req.user.id
  });

  res.json(sale);
});

export default router;
