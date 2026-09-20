import express from 'express';
import User from '../models/User';
import Restaurant from '../models/Restaurant';
import Booking from '../models/Booking';
import Review from '../models/Review';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = express.Router();

router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const [totalUsers, totalRestaurants, totalBookings, totalRevenue] = await Promise.all([
      User.countDocuments(),
      Restaurant.countDocuments(),
      Booking.countDocuments({ status: 'CONFIRMED' }),
      Booking.aggregate([{ $match: { status: 'CONFIRMED' } }, { $group: { _id: null, total: { $sum: '$price' } } }])
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
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

router.get('/chart-data', authenticateToken, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const monthlyRevenue = await Booking.aggregate([
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

    const categoryStats = await Restaurant.aggregate([
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
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch chart data' });
  }
});

export default router;