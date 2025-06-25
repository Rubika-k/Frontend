// controllers/userController.js
import User from '../models/User.js';


// GET all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    // Only admin can see all users — make sure this route is protected!
    const users = await User.find().select('-password'); // remove password from response

    res.status(200).json({
      message: 'All users fetched successfully',
      total: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    // Allow if the user is viewing their own profile or is an admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Cannot view other user profiles' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserById:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


export const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { fullName, phone, address } = req.body;
  user.fullName = fullName || user.fullName;
  user.phone = phone || user.phone;
  user.address = address || user.address;

  await user.save();
  res.json({ message: 'User updated' });
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};
