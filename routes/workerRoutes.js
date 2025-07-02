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

// ✅ Public or logged-in users (customer/worker) can view workers by category
router.get('/', getWorkersByCategory); // eg: /api/workers?category=Electrician

// Admin: View all workers (no filter)
router.get('/all', verifyToken, isAdmin, getAllWorkers);

// Admin: Get worker by ID
router.get('/:id', verifyToken, isAdmin, getWorkerById);

// Admin: Add a new worker
router.post('/', verifyToken, isAdmin, createWorker);

// Admin: Update a worker
router.put('/:id', verifyToken, isAdmin, updateWorker);

// Admin: Delete a worker
router.delete('/:id', verifyToken, isAdmin, deleteWorker);

export default router;
