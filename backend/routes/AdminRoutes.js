import express from 'express';
import { getAllUsers, getAllServiceProviders, getAllService, BlockUser, UnBlockUser , CreateCategory, DeleteCategory , getCategory} from '../controllers/AdminController.js';

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/service-providers', getAllServiceProviders);
router.get('/services', getAllService);
router.get('/categories', getCategory);
router.put('/block-user/:userId', BlockUser);
router.put('/unblock-user/:userId', UnBlockUser);
router.post('/create-category', CreateCategory);
router.delete('/delete-category/:categoryId', DeleteCategory);

export default router;