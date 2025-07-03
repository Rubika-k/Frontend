// controllers/bookingController.js
import Booking from '../models/Booking.js';
import User from '../models/User.js';

// ========== CREATE BOOKINGS ==========
export const createBooking = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }
    const booking = new Booking({
      ...req.body,
      userId: req.user._id
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error("Booking creation failed:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// ========== GET USER BOOKINGS ==========
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.id }).populate('workerId');
    if (!bookings.length) {
      return res.status(404).json({ message: 'No bookings found for this user' });
    }
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user bookings', error: err.message });
  }
};
// ========== GET ALL BOOKINGS ==========
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId');
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
};

// ========== UPDATE BOOKING STATUS ==========
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.status = req.body.status;
    await booking.save();
    res.status(200).json({ message: 'Booking status updated', booking });
  } catch (err) {
    res.status(400).json({ message: 'Failed to update booking status', error: err.message });
  }
};
// ========== DELETE BOOKING ==========
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete booking', error: err.message });
  }
};

