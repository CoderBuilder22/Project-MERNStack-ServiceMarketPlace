import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider" },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  rating: Number,
  comment: String
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
