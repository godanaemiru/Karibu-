import mongoose from "mongoose";

const creditSchema = new mongoose.Schema({
  buyerName: { type: String, minlength: 2 },
  nationalId: { type: String, match: /^[A-Z]{2}[0-9]{8}[A-Z]$/ },
  location: String,
  contact: String,
  amountDue: Number,
  agentName: String,
  dueDate: Date,
  produceName: String,
  tonnage: Number,
  branch: String,
  dispatchDate: { type: Date, default: Date.now },
  status: { type: String, default: "pending" }
});

export default mongoose.model("CreditSale", creditSchema);
