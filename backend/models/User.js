import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ["customer", "provider", "admin"], default: "customer" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  bio: String,
  skills: String,
  photo: String,
  city: String,
  tel: String,
  jobsCompleted: { type: Number, default: 0 },
  Rating: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  isBlocked : { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
