import express from 'express';
import { createService, DeleteService, UpdateService, getServicesByProvider } from '../controllers/ProviderController.js';

const router = express.Router();

router.post('/service', createService);
router.delete('/service/:serviceId', DeleteService);
router.put('/service/:serviceId', UpdateService);
router.get('/services/provider/:providerId', getServicesByProvider);

export default router;