import express from 'express';
import { getUserById, updateUser, deleteUser, getAllUsers } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { upload } from '../middlewares/upload.js';
import User from '../models/User.js';

const router = express.Router();
router.get('/', verifyToken, isAdmin, getAllUsers);
router.get('/:id', verifyToken, getUserById);
router.put('/:id', verifyToken, isAdmin, updateUser);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

// Upload profile picture
router.post('/me/profile-picture', verifyToken, upload.single('profilePicture'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { profilePicture: `/uploads/profile-pictures/${req.file.filename}` },
    { new: true }
  );
  res.json({ profilePicture: user.profilePicture });
});

// Get current user info (including profile picture)
router.get('/me', verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

export default router;