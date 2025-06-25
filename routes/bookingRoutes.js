import express from 'express';
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking
} from '../controllers/bookingController.js';

import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// User creates a booking
router.post('/', verifyToken, createBooking);

// User gets their own bookings
router.get('/user/:id', verifyToken, getUserBookings);

// Admin gets all bookings
router.get('/', verifyToken, isAdmin, getAllBookings);

// Admin updates booking status
router.put('/:id', verifyToken, isAdmin, updateBookingStatus);

// Admin deletes a booking
router.delete('/:id', verifyToken, isAdmin, deleteBooking);

export default router;
