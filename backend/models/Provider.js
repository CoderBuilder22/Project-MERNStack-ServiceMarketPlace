import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobsCompleted: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Provider", providerSchema);
