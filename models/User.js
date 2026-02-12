import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
  role: { type: String, enum: ["director", "manager", "agent"], required: true },
  branch: { type: String },
  phone: String,
  password: { type: String, required: true }
});

export default mongoose.model("User", userSchema);
