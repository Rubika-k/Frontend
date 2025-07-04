// controllers/userController.js
import mongoose from 'mongoose';
import User from '../models/User.js';
// import { uploadToCloudinary } from '../middlewares/upload.js';
// import cloudinary from '../utils/cloudinary.js';


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    // ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: 'Error fetching user',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error updating user', error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user);
  } catch (err) {
    console.error('Error in getUserProfile:', err);
      res.status(500).json({ 
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  };


// export const updateProfilePicture = async (req, res) => {
//   try {
//     if (!req.file) {
//       console.log('No file received in request');
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     console.log('File received:', {
//       originalname: req.file.originalname,
//       mimetype: req.file.mimetype,
//       size: req.file.size
//     });

//     const result = await uploadToCloudinary(req.file.buffer);
//     console.log('Cloudinary upload result:', result);

//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       { profilePicture: result.secure_url },
//       { new: true }
//     ).select('-password');

//     res.json({
//       message: 'Profile picture updated successfully',
//       profilePicture: user.profilePicture
//     });
//   } catch (err) {
//     console.error('FULL UPLOAD ERROR:', err);
//     res.status(500).json({
//       message: 'Error uploading profile picture',
//       error: process.env.NODE_ENV === 'development' ? err.message : 'Failed to process image'
//     });
//   }
// };