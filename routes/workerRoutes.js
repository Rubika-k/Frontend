import express from 'express';
import {
  getAllWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker
} from '../controllers/workerController.js';

import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Admin: View all workers
router.get('/', verifyToken, isAdmin, getAllWorkers);

// Admin: Get worker by ID
router.get('/:id', verifyToken, isAdmin, getWorkerById);

// Admin: Add a new worker
router.post('/', verifyToken, isAdmin, createWorker);

// Admin: Update a worker
router.put('/:id', verifyToken, isAdmin, updateWorker);

// Admin: Delete a worker
router.delete('/:id', verifyToken, isAdmin, deleteWorker);


export default router;
