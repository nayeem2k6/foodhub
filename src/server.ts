// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.static('public'));

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/restaurants', require('./routes/restaurants'));
// app.use('/api/reviews', require('./routes/reviews'));
// app.use('/api/bookings', require('./routes/bookings'));
// app.use('/api/dashboard', require('./routes/dashboard'));
// app.use('/api/ai', require('./routes/ai'));

// // Seed data
// app.post('/api/seed', async (req, res) => {
//   // Add seed data here
//   res.json({ success: true, message: 'Seeded' });
// });

// // MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI!)
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch(err => console.error('❌ MongoDB Connection Error:', err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });




import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import restaurantRoutes from './routes/restaurants';
import reviewRoutes from './routes/reviews';
import bookingRoutes from './routes/bookings';
import dashboardRoutes from './routes/dashboard';
import aiRoutes from './routes/ai';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);

// Seed data
app.post('/api/seed', async (req, res) => {
  res.json({ success: true, message: 'Seeded' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});