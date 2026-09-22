"use strict";
// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const restaurants_1 = __importDefault(require("./routes/restaurants"));
const reviews_1 = __importDefault(require("./routes/reviews"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const ai_1 = __importDefault(require("./routes/ai"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: true,
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/restaurants', restaurants_1.default);
app.use('/api/reviews', reviews_1.default);
app.use('/api/bookings', bookings_1.default);
app.use('/api/dashboard', dashboard_1.default);
app.use('/api/ai', ai_1.default);
// Seed data
app.post('/api/seed', async (req, res) => {
    res.json({ success: true, message: 'Seeded' });
});
// MongoDB Connection
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map