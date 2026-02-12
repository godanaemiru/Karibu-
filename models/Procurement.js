import mongoose from "mongoose";

const procurementSchema = new mongoose.Schema({
  produceName: { type: String, required: true },
  type: { type: String, required: true, minlength: 2 },
  date: { type: Date, default: Date.now },
  tonnage: { type: Number, required: true, min: 1000 },
  cost: { type: Number, required: true, min: 10000 },
  dealerName: { type: String, required: true, minlength: 2 },
  dealerContact: {
    type: String,
    match: /^(\+256|0)[0-9]{9}$/
  },
  branch: { type: String, required: true },
  sellingPrice: { type: Number, required: true },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model("Procurement", procurementSchema);


