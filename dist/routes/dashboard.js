"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
const Booking_1 = __importDefault(require("../models/Booking"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/stats', auth_1.authenticateToken, async (req, res) => {
    try {
        const [totalUsers, totalRestaurants, totalBookings, totalRevenue] = await Promise.all([
            User_1.default.countDocuments(),
            Restaurant_1.default.countDocuments(),
            Booking_1.default.countDocuments({ status: 'CONFIRMED' }),
            Booking_1.default.aggregate([{ $match: { status: 'CONFIRMED' } }, { $group: { _id: null, total: { $sum: '$price' } } }])
        ]);
        res.json({
            success: true,
            message: 'Dashboard stats fetched successfully',
            data: {
                totalUsers,
                totalRestaurants,
                totalBookings,
                totalRevenue: totalRevenue[0]?.total || 0
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch stats' });
    }
});
router.get('/chart-data', auth_1.authenticateToken, async (req, res) => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const monthlyRevenue = await Booking_1.default.aggregate([
            { $match: { status: 'CONFIRMED', createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    total: { $sum: '$price' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        const categoryStats = await Restaurant_1.default.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        res.json({
            success: true,
            message: 'Chart data fetched successfully',
            data: {
                monthlyRevenue,
                categoryStats
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch chart data' });
    }
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map