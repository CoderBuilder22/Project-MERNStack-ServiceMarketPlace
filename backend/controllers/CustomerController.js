import Reservation from "../models/Reservation.js";
import Review from "../models/Review.js";
import Service from "../models/Service.js";
import Provider from "../models/Provider.js";


export const bookService = async (req, res) => {
  const { serviceId, customerId } = req.body;

  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const formattedDate = nextWeek.toISOString().split("T")[0];

    const newReservation = new Reservation({
      serviceId,
      customerId,
      providerId: service.providerId,
      date: formattedDate,
      status: "pending",
    });

    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  const { reservationId } = req.params;
  try {
    const reservation = await Reservation.findByIdAndDelete(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.status(200).json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  const { customerId } = req.params;
  try {
    const reservations = await Reservation.find({ customerId }).populate({
      path: "serviceId",
      populate: {
        path: "providerId",
        populate: { path: "userId", model: "User" },
      },
    });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};




//updateProfile()

//addReview()
