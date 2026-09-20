import mongoose, { Schema } from 'mongoose';
import { Restaurant } from '../types';

const restaurantSchema = new Schema<Restaurant>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  location: { type: String, required: true },
  category: { type: String, required: true },
  cuisine: [{ type: String }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<Restaurant>('Restaurant', restaurantSchema);