// routes/taskRoutes.js
import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Any logged-in user can:
router.post('/', protect, createTask);
router.get('/', protect, getAllTasks);
router.get('/:id', protect, getTaskById);

// Only creator or admin:
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

export default router;
