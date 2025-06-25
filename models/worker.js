import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  profilePicture: String,
  address: String,
  experience: Number,
  category: String,
  isVerified: Boolean,
  registrationFeePaid: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const Worker = mongoose.model('Worker', workerSchema);
export default Worker;


