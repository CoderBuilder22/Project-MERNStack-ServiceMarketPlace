import Reservation from "../models/Reservation.js";
import Review from "../models/Review.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
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
    const reservations = await Reservation.find({ customerId })
      .populate({
        path: "serviceId",
        populate: {
          path: "providerId",
          populate: {
            path: "userId",
            model: "User",
            select: "name email photo city tel"
          }
        }
      });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const addReview = async (req, res) => {
  try {
    const { reservationId, rating, comment, customerId } = req.body;

    if (!reservationId || !rating || !customerId) {
      return res.status(400).json({ message: "Reservation ID, rating and customer ID are required" });
    }

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.customerId.toString() !== customerId.toString()) {
      return res.status(403).json({ message: "You are not authorized to review this reservation" });
    }

    if (reservation.status.toLowerCase() !== "completed") {
      return res.status(400).json({ message: "You can only review completed reservations" });
    }

    let existingReview = await Review.findOne({ customerId, reservationId });

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();
      return res.status(200).json({ message: "Review updated successfully", review: existingReview });
    }

    // Create new review
    const newReview = new Review({
      customerId,
      providerId: reservation.providerId,
      serviceId: reservation.serviceId,
      rating,
      comment
    });

    await newReview.save();

    const provider = await Provider.findById(reservation.providerId);

    if (provider) {
      const reviews = await Review.find({ providerId: provider._id });
      const averageRating =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

      provider.averageRating = averageRating;
      await provider.save();

      const providerUser = await User.findById(provider.userId);
      if (providerUser) {
        providerUser.Rating = averageRating;
        await providerUser.save();
      }
    }

    res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const markReservationCompleted = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const reservation = await Reservation.findById(reservationId).populate('serviceId');
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.customerId.toString() !== customerId.toString()) {
      return res.status(403).json({ message: "You are not authorized to update this reservation" });
    }

    if (reservation.status.toLowerCase() === "completed") {
      return res.status(400).json({ message: "Reservation already marked as completed" });
    }

    reservation.status = "completed";
    await reservation.save();

    const providerUser = await User.findById(reservation.providerId);
    if (providerUser) {
      providerUser.totalEarnings += reservation.serviceId.price || 0;
      providerUser.jobsCompleted += 1;
      await providerUser.save();
    }

    res.status(200).json({ message: "Reservation marked as completed", reservation });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};





//updateProfile()



