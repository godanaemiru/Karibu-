import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  produceName: String,
  branch: String,
  tonnage: Number,
  amountPaid: Number,
  buyerName: String,
  agentName: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Sale", saleSchema);
