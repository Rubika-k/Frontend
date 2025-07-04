import express from 'express';
import { createBooking, getBookingsByUser, getAllBookings } from '../controllers/bookingController.js';
import { verifyToken , isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createBooking);

router.get('/user/:userId', verifyToken, getBookingsByUser);

router.get('/admin/bookings', verifyToken, isAdmin, getAllBookings);

router.get('/bookings/admin', verifyToken, isAdmin, getAllBookings);


export default router;
