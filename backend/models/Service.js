import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  photoURL: String,
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider" },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }
}, { timestamps: true });

export default mongoose.model("Service", serviceSchema);
