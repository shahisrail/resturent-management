import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'restaurant', 'customer', 'delivery'],
    required: true,
  },
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
