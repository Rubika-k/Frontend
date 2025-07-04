import express from 'express';
import { createBooking, getBookingsByUser, getAllBookings, updateBookingStatus, deleteBooking } from '../controllers/bookingController.js';
import { verifyToken , isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createBooking);

router.get('/user/:userId', verifyToken, getBookingsByUser);

router.get('/admin/bookings', verifyToken, isAdmin, getAllBookings);

router.put('/:id/status', verifyToken, isAdmin, updateBookingStatus);

router.delete('/:id', verifyToken, isAdmin, deleteBooking);


export default router;
