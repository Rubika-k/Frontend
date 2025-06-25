// routes/userRoutes.js
import express from 'express';
import { getUserById, updateUser, deleteUser, getAllUsers } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();
router.get('/', verifyToken, isAdmin, getAllUsers);
router.get('/:id',verifyToken, getUserById);
router.put('/:id', verifyToken, isAdmin, updateUser); // restrict update/delete to admin
router.delete('/:id', verifyToken, isAdmin, deleteUser);

export default router;
