import Worker from '../models/worker.js';

// GET /api/workers
export const getAllWorkers = async (req, res) => {
  const workers = await Worker.find();
  res.json(workers);
};

export const getWorkerById = async (req, res) => {
  const worker = await Worker.findById(req.params.id);
  if (!worker) return res.status(404).json({ message: 'Worker not found' });
  res.json(worker);
};

export const createWorker = async (req, res) => {
  const worker = await Worker.create(req.body);
  res.status(201).json(worker);
};

export const updateWorker = async (req, res) => {
  const updated = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

export const deleteWorker = async (req, res) => {
  await Worker.findByIdAndDelete(req.params.id);
  res.json({ message: 'Worker deleted' });
};
