import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  profilePicture: { type: String },
  address: { type: String },
  experience: { type: Number, default: 0 },
  category: { type: String },
  isVerified: { type: Boolean, default: false },
  registrationFeePaid: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  nextAvailableTime: { type: String }, // You can change to Date if needed
  createdAt: { type: Date, default: Date.now }
});

const Worker = mongoose.model('Worker', workerSchema);
export default Worker;
