import mongoose, { Schema } from 'mongoose';
import { Review } from '../types';

const reviewSchema = new Schema<Review>({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true }
}, { timestamps: true });

export default mongoose.model<Review>('Review', reviewSchema);