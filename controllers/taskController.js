import Task from '../models/Task.js';


export const createTask = async (req, res) => {
  const { title, description, assignedTo } = req.body;
  const task = await Task.create({ title, description, createdBy: req.user._id, assignedTo });
  res.status(201).json(task);
};

export const getUserTasks = async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user._id });
  res.status(200).json(tasks);
};

export const getWorkerTasks = async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user._id });
  res.status(200).json(tasks);
};

export const updateTaskStatus = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.status(200).json(task);
};

export const deleteTask = async (req, res) => {
  try {
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task' });
  }
};


export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find(); 
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tasks' });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving task' });
  }
};
export const updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, assignedTo, status },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task' });
  }
};