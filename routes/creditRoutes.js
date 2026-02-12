import express from "express";
import CreditSale from "../models/CreditSale.js";
import Produce from "../models/Produce.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/roles.js";

const router = express.Router();

router.post("/", protect, authorize("agent", "manager"), async (req, res) => {
  const { produceName, tonnage } = req.body;

  const produce = await Produce.findOne({
    name: produceName,
    branch: req.user.branch
  });

  if (!produce || produce.quantityInStock < tonnage)
    return res.status(400).json({ message: "Out of stock" });

  produce.quantityInStock -= tonnage;
  await produce.save();

  const credit = await CreditSale.create({
    ...req.body,
    branch: req.user.branch,
    agentName: req.user.id
  });

  res.json(credit);
});

export default router;
