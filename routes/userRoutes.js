import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { getAllUsers, deleteUser } from '../controllers/userControllers/userController.js';
import { getOwnProfile, updateProfile } from '../controllers/userControllers/profileController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();


router.get('/admin/users', protect, authorizeRoles('admin'), getAllUsers);
router.delete('/admin/user/:id', protect, authorizeRoles('admin'), deleteUser);
router.get('/profile', authMiddleware, getOwnProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllUsers);

export default router;
