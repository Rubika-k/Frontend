// routes/categoryRoutes.js
import express from 'express';
import {
  addCategory,
  getAllCategories,
  deleteCategory
} from '../controllers/categoryController.js';

import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Public: View all categories
router.get('/', getAllCategories);

// Admin: Create and delete categories
router.post('/', verifyToken, isAdmin, addCategory);
router.delete('/:id', verifyToken, isAdmin, deleteCategory);

export default router;
