import express from 'express';
import {
  createBooking,
  getBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking
} from '../controllers/bookingController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// User creates a booking (protected route)
router.post('/', verifyToken, createBooking);

// User gets their own bookings (protected route)
router.get('/my-bookings', verifyToken, getBookings); // Changed route

// Admin gets all bookings (protected + admin only)
router.get('/all', verifyToken, isAdmin, getAllBookings); // Added '/all' for clarity

// Update booking status (protected + admin only)
router.patch('/:id/status', verifyToken, isAdmin, updateBookingStatus); // More RESTful

// Delete booking (protected + admin only)
router.delete('/:id', verifyToken, isAdmin, deleteBooking);

export default router;