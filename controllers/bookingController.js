import Booking from '../models/Booking.js';
import User from '../models/User.js';

// ========== CREATE BOOKING ==========
export const createBooking = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const booking = new Booking({
      ...req.body,
      user: req.user._id // Changed to 'user' for consistency
    });

    await booking.save();
    
    // Populate useful fields in response
    const populatedBooking = await Booking.populate(booking, [
      { path: 'user', select: 'name email' },
      { path: 'service', select: 'name price' }
    ]);

    res.status(201).json({ 
      success: true,
      data: populatedBooking 
    });

  } catch (error) {
    console.error("Booking creation failed:", error);
    res.status(400).json({ 
      success: false,
      message: "Booking creation failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ========== GET USER BOOKINGS ==========
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('user', 'name email')
      .populate('service', 'name price duration')
      .sort({ createdAt: -1 });
      
    res.json({ 
      success: true,
      count: bookings.length,
      data: bookings 
    });
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching bookings',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// ========== GET ALL BOOKINGS (ADMIN) ==========
export const getAllBookings = async (req, res) => {
  try {
    // Add admin check if needed
    if (!req.user.isAdmin) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('service', 'name category');

    res.status(200).json({ 
      success: true,
      count: bookings.length,
      data: bookings 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch bookings',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// ========== UPDATE BOOKING STATUS ==========
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify user owns booking or is admin
    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to update this booking" });
    }

    booking.status = req.body.status;
    await booking.save();

    res.status(200).json({ 
      success: true,
      message: 'Booking status updated',
      data: booking 
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: 'Failed to update booking status',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// ========== DELETE BOOKING ==========
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify user owns booking or is admin
    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this booking" });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({ 
      success: true,
      message: 'Booking deleted successfully' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete booking',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};