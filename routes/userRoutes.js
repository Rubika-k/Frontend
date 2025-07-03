import express from 'express';
import { 
  getUserById, 
  updateUser, 
  deleteUser, 
  getAllUsers,
  getUserProfile,
  updateProfilePicture 
} from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import upload from '../middlewares/upload.js';
const router = express.Router();

// Admin routes
router.get('/', verifyToken, isAdmin, getAllUsers);
router.get('/:id', verifyToken, getUserById);
router.put('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

// User profile routes
router.get('/me', verifyToken, getUserProfile); // Using the controller function

router.post('/me/profile-picture', 
  verifyToken, 
  upload.single('profilePicture'), 
  updateProfilePicture // Using the controller function
);


export default router;