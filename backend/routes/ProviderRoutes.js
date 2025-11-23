import express from 'express';
import multer from 'multer';
import { createService, DeleteService, UpdateService, getServicesByProvider, getServicesById,getAllServices,getBookingsByProvider,acceptBooking,rejectBooking,getReviewsByProvider } from '../controllers/ProviderController.js';

const router = express.Router();
const upload = multer({ dest: 'public/images/' });

router.post('/service', upload.single('photo'), createService);
router.delete('/service/:serviceId', DeleteService);
router.put('/service/:serviceId', upload.single('photo'), UpdateService);
router.get('/services/provider/:providerId', getServicesByProvider);
router.get('/service/:serviceId', getServicesById);
router.get('/service', getAllServices);
router.get('/bookings/provider/:providerId', getBookingsByProvider);
router.put('/booking/accept/:bookingId', acceptBooking);
router.put('/booking/reject/:bookingId', rejectBooking);
router.get('/reviews/:providerId',getReviewsByProvider);

export default router;
