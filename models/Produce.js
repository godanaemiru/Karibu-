import mongoose from "mongoose";

const produceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, minlength: 2 },
  branch: { type: String, required: true },
  quantityInStock: { type: Number, default: 0 },
  sellingPrice: { type: Number, required: true }
});

export default mongoose.model("Produce", produceSchema);
