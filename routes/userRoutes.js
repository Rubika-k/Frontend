// routes/userRoutes.js
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
import {
  updateProfile,
  deleteUser,
  getAllUsers
} from '../controllers/userControllers/profileController.js';

const router = express.Router();

// Update own profile (authenticated users)
router.put('/me', authMiddleware, updateProfile);

// Admin: View all users
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllUsers);

// Admin: Delete user by ID
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);

export default router;
