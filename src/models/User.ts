import mongoose, { Schema } from 'mongoose';
import { User } from '../types';

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  avatar: { type: String }
}, { timestamps: true });

export default mongoose.model<User>('User', userSchema);