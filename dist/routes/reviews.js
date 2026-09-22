"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Review_1 = __importDefault(require("../models/Review"));
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const router = express_1.default.Router();
const reviewSchema = zod_1.z.object({
    rating: zod_1.z.number().min(1).max(5),
    comment: zod_1.z.string().min(5),
    restaurantId: zod_1.z.string()
});
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { rating, comment, restaurantId } = reviewSchema.parse(req.body);
        // Check if restaurant exists
        const restaurant = await Restaurant_1.default.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found' });
        }
        const review = new Review_1.default({
            rating,
            comment,
            userId: req.user._id,
            restaurantId
        });
        await review.save();
        // Update restaurant average rating
        const reviews = await Review_1.default.find({ restaurantId });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await Restaurant_1.default.findByIdAndUpdate(restaurantId, { rating: Math.round(avgRating * 10) / 10 });
        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            data: review
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, message: error.errors[0].message });
        }
        res.status(500).json({ success: false, message: 'Failed to add review' });
    }
});
router.get('/restaurant/:restaurantId', async (req, res) => {
    try {
        const reviews = await Review_1.default.find({ restaurantId: req.params.restaurantId })
            .populate('userId', 'name avatar')
            .sort('-createdAt');
        res.json({
            success: true,
            message: 'Reviews fetched successfully',
            data: reviews
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
    }
});
exports.default = router;
// import express from 'express';
// import Review from '../models/Review';
// import Restaurant from '../models/Restaurant';
// import { authenticateToken } from '../middleware/auth';
// import { z } from 'zod';
// const router = express.Router();
// /* -----------------------------
//    VALIDATION SCHEMA
// ------------------------------*/
// const reviewSchema = z.object({
//   rating: z.number().int().min(1).max(5),
//   comment: z.string().min(5).max(500),
//   restaurantId: z.string().min(1)
// });
// /* -----------------------------
//    POST REVIEW (CREATE)
// ------------------------------*/
// router.post('/', authenticateToken, async (req, res) => {
//   try {
//     const { rating, comment, restaurantId } = reviewSchema.parse(req.body);
//     // 1. Check restaurant exists
//     const restaurant = await Restaurant.findById(restaurantId);
//     if (!restaurant) {
//       return res.status(404).json({
//         success: false,
//         message: 'Restaurant not found'
//       });
//     }
//     // 2. Prevent duplicate review (same user + same restaurant)
//     const existingReview = await Review.findOne({
//       restaurantId,
//       userId: req.user!._id
//     });
//     if (existingReview) {
//       return res.status(400).json({
//         success: false,
//         message: 'You already reviewed this restaurant'
//       });
//     }
//     // 3. Create review
//     const review = await Review.create({
//       rating,
//       comment,
//       userId: req.user!._id,
//       restaurantId
//     });
//     // 4. Recalculate average rating (optimized)
//     const result = await Review.aggregate([
//       { $match: { restaurantId } },
//       {
//         $group: {
//           _id: "$restaurantId",
//           avgRating: { $avg: "$rating" }
//         }
//       }
//     ]);
//     const avgRating = result[0]?.avgRating || 0;
//     await Restaurant.findByIdAndUpdate(restaurantId, {
//       rating: Math.round(avgRating * 10) / 10
//     });
//     return res.status(201).json({
//       success: true,
//       message: 'Review added successfully',
//       data: review
//     });
//   } catch (error: any) {
//     if (error?.name === 'ZodError') {
//       return res.status(400).json({
//         success: false,
//         message: error.errors[0].message
//       });
//     }
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to add review'
//     });
//   }
// });
// /* -----------------------------
//    GET REVIEWS (BY RESTAURANT)
// ------------------------------*/
// router.get('/restaurant/:restaurantId', async (req, res) => {
//   try {
//     const reviews = await Review.find({
//       restaurantId: req.params.restaurantId
//     })
//       .populate('userId', 'name avatar')
//       .sort({ createdAt: -1 });
//     return res.json({
//       success: true,
//       message: 'Reviews fetched successfully',
//       data: reviews
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch reviews'
//     });
//   }
// });
// export default router;
//# sourceMappingURL=reviews.js.map