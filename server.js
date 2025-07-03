// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js'; 
import workerRoutes from './routes/workerRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js'; 
import path from 'path'


const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/workers', workerRoutes); // Only accessible by admin
app.use('/api/categories', categoryRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });
