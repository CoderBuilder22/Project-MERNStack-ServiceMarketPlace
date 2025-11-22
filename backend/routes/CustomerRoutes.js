import express from 'express';
import { bookService, cancelBooking, getMyBookings, addReview, markReservationCompleted } from '../controllers/CustomerController.js';

const router = express.Router();

router.post('/book', bookService);
router.delete('/cancel/:reservationId', cancelBooking);
router.get('/bookings/:customerId', getMyBookings);

router.post('/review', addReview);
router.patch('/complete/:reservationId', markReservationCompleted);

export default router;
