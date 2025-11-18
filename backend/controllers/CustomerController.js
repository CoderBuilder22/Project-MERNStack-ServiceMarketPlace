import Reservation from '../models/Reservation.js';
import Review from '../models/Review.js';
import Service from '../models/Service.js';



export const bookService = async (req, res) => {
    const { serviceId, customerId } = req.body;
    try {
        const newReservation = new Reservation({ serviceId, customerId, date: new Date().getDate(), status: 'pending' });
        await newReservation.save();
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const cancelBooking = async (req, res) => {
    const { reservationId } = req.params;
    try {
        const reservation = await Reservation.findByIdAndDelete(reservationId);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        res.status(200).json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const getMyBookings = async (req, res) => {
    const { customerId } = req.params;
    try {
        const reservations = await Reservation.find({ customerId }).populate('serviceId');
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

//updateProfile()

//addReview()

//viewMyBookings()

//SearchServices()