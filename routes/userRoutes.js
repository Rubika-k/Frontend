import express from 'express';
import { 
  getUserById, 
  updateUser, 
  deleteUser, 
  getAllUsers,
  // getUserProfile,
  // updateProfilePicture 
} from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
// import upload from '../middlewares/upload.js'; // Only need the default export

const router = express.Router();

// Admin routes
router.get('/', verifyToken, isAdmin, getAllUsers);
router.get('/:id', verifyToken, getUserById);
router.put('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

// // User profile routes
// router.get('/me', verifyToken, getUserProfile);

// router.post(
//   '/me/profile-picture',
//   verifyToken,
//   // upload.single('profilePicture'),
//   async (req, res, next) => {
//     try {
//       await updateProfilePicture(req, res);
//     } catch (err) {
//       if (!res.headersSent) {
//         res.status(500).json({
//           message: 'Error processing profile picture upload',
//           error: process.env.NODE_ENV === 'development' ? err.message : undefined
//         });
//       }
//     }
//   }
// );

export default router;