import express from 'express';
import {
  getAllWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
  getWorkersByCategory
} from '../controllers/workerController.js';

import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

//  Public route: Get workers by category
// Example: /api/workers?category=Plumber
router.get('/', getWorkersByCategory);

//  Admin-only routes:
router.get('/', verifyToken, isAdmin, getAllWorkers);
router.get('/:id', verifyToken, isAdmin, getWorkerById);
router.post('/', verifyToken, isAdmin, createWorker);
router.put('/:id', verifyToken, isAdmin, updateWorker);
router.delete('/:id', verifyToken, isAdmin, deleteWorker);

export default router;
