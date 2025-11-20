import express from 'express';
import { bookService, cancelBooking, getMyBookings} from '../controllers/CustomerController.js';

const router = express.Router();
router.post('/book', bookService);
router.delete('/cancel/:reservationId', cancelBooking);
router.get('/bookings/:customerId', getMyBookings);


export default router;