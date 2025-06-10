
// Removed duplicate getAllUsers declaration to fix redeclaration error

export const getUserById = async (req, res) => {
  try {
    // Your logic here (e.g., User.findById(req.params.id))
    res.status(200).json({ message: 'Get user by ID working' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};  
export const deleteUser = async (req, res) => {
  try {
    // This is placeholder logic — you can change based on your DB/model setup
    const userId = req.params.id;

    // Example with Mongoose:
    // await User.findByIdAndDelete(userId);

    res.status(200).json({ message: `User with ID ${userId} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};
export const getOwnProfile = async (req, res) => {
  res.status(200).json(req.user); // From authMiddleware
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;
  // Add other fields as needed

  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
};

export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
};



