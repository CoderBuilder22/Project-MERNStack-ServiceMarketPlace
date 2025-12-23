import Service from "../models/Service.js";
import User from "../models/User.js";
import Provider from "../models/Provider.js";
import Reservation from "../models/Reservation.js";
import Review from "../models/Review.js";



export const createService = async (req, res) => {
  try {
    const { title, description, price, providerId, categoryId } = req.body;
    const photoURL = req.file ? `/images/${req.file.filename}` : "";
    const newService = new Service({
      title,
      description,
      price,
      photoURL,
      providerId,
      categoryId,
    });
    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const DeleteService = async (req, res) => {
  const { serviceId } = req.params;
  try {
    const service = await Service.findByIdAndDelete(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const UpdateService = async (req, res) => {
  const { serviceId } = req.params;
  const { title, description, price, categoryId } = req.body;
  const photoURL = req.file ? `/images/${req.file.filename}` : null;
  const updateData = { title, description, price, categoryId };
  if (photoURL) updateData.photoURL = photoURL;
  try {
    const NewSerivce = await Service.findByIdAndUpdate(serviceId, updateData, {
      new: true,
    });
    if (!NewSerivce) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(NewSerivce);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getServicesByProvider = async (req, res) => {
  const { providerId } = req.params;
  try {
    const services = await Service.find({ providerId });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getServicesById = async (req, res) => {
  const { serviceId } = req.params;
  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getBookingsByProvider = async (req, res) => {
  const { providerId } = req.params;
  try {
    const bookings = await Reservation.find({ providerId })
      .populate("customerId", "name email tel city")
      .populate("serviceId", "title price photoURL");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const acceptBooking = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const booking = await Reservation.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    booking.status = "accepted";
    await booking.save();
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const rejectBooking = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const booking = await Reservation.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    booking.status = "rejected";
    await booking.save();
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const updateBookingDate = async (req, res) => {
  const { bookingId } = req.params;
  const { newDate, providerId } = req.body;
  try {
    const booking = await Reservation.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.providerId.toString() !== providerId) {
      return res.status(403).json({ message: "Unauthorized: You can only update your own bookings" });
    }
    booking.date = new Date(newDate);
    await booking.save();
    res.status(200).json({ message: "Booking date updated successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const calculateAndUpdateProviderRating = async (providerId) => {
  try {
    const reviews = await Review.find({ providerId });

    const mostRecentReviewsMap = new Map();

    reviews.forEach((review) => {
      const serviceIdStr = review.serviceId.toString();
      if (
        !mostRecentReviewsMap.has(serviceIdStr) ||
        mostRecentReviewsMap.get(serviceIdStr).createdAt < review.createdAt
      ) {
        mostRecentReviewsMap.set(serviceIdStr, review);
      }
    });

    const mostRecentReviews = Array.from(mostRecentReviewsMap.values());

    
    const totalRating = mostRecentReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = mostRecentReviews.length > 0 ? totalRating / mostRecentReviews.length : 0;

    
    const provider = await User.findById(providerId);
    if (provider) {
      provider.Rating = averageRating;
      await provider.save();
    }

    return averageRating;
  } catch (error) {
    console.error("Error calculating/updating provider rating:", error);
    throw error;
  }
};



// updateProfile()

export const getReviewsByProvider = async (req, res) => {
  const { providerId } = req.params;

  try {
    const reviews = await Review.find({ providerId })
      .populate({
        path: "customerId",
        select: "name"
      })
      .populate({
        path: "serviceId",
        select: "title"
      });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getAllCustomersBookings = async (req, res) => {
  const { providerId } = req.params;

  try {
    const bookings = await Reservation.find({ providerId })
      .populate("customerId", "name email tel city")
      .populate("serviceId", "title price photoURL");

    const customersMap = new Map();

    bookings.forEach(booking => {
      const customerId = booking.customerId._id.toString();
      if (!customersMap.has(customerId)) {
        customersMap.set(customerId, {
          customer: booking.customerId,
          bookings: []
        });
      }
      customersMap.get(customerId).bookings.push({
        _id: booking._id,
        date: booking.date,
        status: booking.status,
        service: booking.serviceId
      });
    });

    const customers = Array.from(customersMap.values());

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



export default {
  createService,
  DeleteService,
  UpdateService,
  getServicesByProvider,
  getBookingsByProvider,
  acceptBooking,
  rejectBooking,
  updateBookingDate,
  calculateAndUpdateProviderRating,
  getReviewsByProvider,
  getAllCustomersBookings,
};

