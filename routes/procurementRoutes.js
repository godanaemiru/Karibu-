import express from "express";
import Procurement from "../models/Procurement.js";
import Produce from "../models/Produce.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/roles.js";

const router = express.Router();

router.post("/", protect, authorize("manager"), async (req, res) => {
  const data = req.body;

  const procurement = await Procurement.create({
    ...data,
    branch: req.user.branch,
    recordedBy: req.user.id
  });

  // Update or create stock
  let produce = await Produce.findOne({
    name: data.produceName,
    branch: req.user.branch
  });

  if (!produce) {
    produce = await Produce.create({
      name: data.produceName,
      type: data.type,
      branch: req.user.branch,
      quantityInStock: data.tonnage,
      sellingPrice: data.sellingPrice
    });
  } else {
    produce.quantityInStock += data.tonnage;
    produce.sellingPrice = data.sellingPrice;
    await produce.save();
  }

  res.json(procurement);
});

export default router;
