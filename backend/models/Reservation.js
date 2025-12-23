import mongoose from "mongoose";


const reservationSchema = new mongoose.Schema({
  date: Date,
  status: String,
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("Reservation", reservationSchema);


