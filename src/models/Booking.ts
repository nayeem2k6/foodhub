import mongoose, { Schema } from 'mongoose';
import { Booking } from '../types';

const bookingSchema = new Schema<Booking>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'], 
    default: 'PENDING' 
  }
}, { timestamps: true });

export default mongoose.model<Booking>('Booking', bookingSchema);