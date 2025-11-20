import mongoose from "mongoose";
import Reservation from "./models/Reservation.js";
import Service from "./models/Service.js";
import dotenv from "dotenv";
dotenv.config();

const fixReservations = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const reservations = await Reservation.find({ providerId: null });
    for (const r of reservations) {
      const service = await Service.findById(r.serviceId);
      if (service && service.providerId) {
        r.providerId = service.providerId;
        await r.save();
        console.log(`Fixed reservation ${r._id}`);
      }
    }

    console.log("All reservations fixed!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixReservations();
