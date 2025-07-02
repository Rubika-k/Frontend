import User from '../models/User.js';

// ✅ Public Controller: Get workers by category
export const getWorkersByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const workers = await User.find({
      role: 'worker',
      category: category,
    }).select('-password'); // Don’t send password

    res.status(200).json(workers);
  } catch (error) {
    console.error('Error in getWorkersByCategory:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// ✅ Admin-only Controllers:
export const getAllWorkers = async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker' }).select('-password');
    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workers', error });
  }
};

export const getWorkerById = async (req, res) => {
  try {
    const worker = await User.findById(req.params.id).select('-password');
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.status(200).json(worker);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching worker', error });
  }
};

export const createWorker = async (req, res) => {
  try {
    const { fullName, email, category, phone, address, available, nextAvailableTime } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Worker with this email already exists' });
    }

    const newWorker = new User({
      fullName,
      email,
      category,
      phone,
      address,
      role: 'worker',
      available,
      nextAvailableTime,
    });

    await newWorker.save();
    res.status(201).json({ message: 'Worker created successfully', worker: newWorker });
  } catch (error) {
    res.status(500).json({ message: 'Error creating worker', error });
  }
};

export const updateWorker = async (req, res) => {
  try {
    const worker = await User.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    Object.assign(worker, req.body); // update fields
    await worker.save();

    res.status(200).json({ message: 'Worker updated', worker });
  } catch (error) {
    res.status(500).json({ message: 'Error updating worker', error });
  }
};

export const deleteWorker = async (req, res) => {
  try {
    const worker = await User.findByIdAndDelete(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.status(200).json({ message: 'Worker deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting worker', error });
  }
};
