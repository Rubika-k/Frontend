import Booking from '../models/Booking.js';

export const createBooking = async (req, res) => {
  try {
    const {
      userId,
      workTitle,
      description,
      serviceLocation,
      preferredDate,
      preferredTime,
      estimatedHours,
      urgency,
      paymentOption
    } = req.body;

    const newBooking = new Booking({
      userId,
      workTitle,
      description,
      serviceLocation,
      preferredDate,
      preferredTime,
      estimatedHours,
      urgency,
      paymentOption
      // ✅ workerId is removed!
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully!', booking: newBooking });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Booking failed', error: error.message });
  }
};



export const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ userId })
      .populate('workerId', 'fullName email phone') // optional: include worker details
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to get bookings' });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;

    if (!status) return res.status(400).json({ message: 'Status is required' });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    await booking.save();

    res.status(200).json({ message: 'Status updated', booking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};


export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ message: 'Failed to delete booking', error: err.message });
  }
};