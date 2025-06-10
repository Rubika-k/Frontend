import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  rating: Number,
  comment: String,
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
