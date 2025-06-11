// controllers/userControllers/profileController.js
import User from '../../models/User.js';

// Update own profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};

// Admin deletes user by ID
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};

// Admin sees all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // hide passwords
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};
