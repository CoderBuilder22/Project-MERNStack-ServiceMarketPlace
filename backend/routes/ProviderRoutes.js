import express from 'express';
import multer from 'multer';
import { createService, DeleteService, UpdateService, getServicesByProvider, getServicesById,getAllServices } from '../controllers/ProviderController.js';

const router = express.Router();
const upload = multer({ dest: 'public/images/' });

router.post('/service', upload.single('photo'), createService);
router.delete('/service/:serviceId', DeleteService);
router.put('/service/:serviceId', upload.single('photo'), UpdateService);
router.get('/services/provider/:providerId', getServicesByProvider);
router.get('/service/:serviceId', getServicesById);
router.get('/service', getAllServices);

export default router;
