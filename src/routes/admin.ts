import express from 'express';
import User from '../models/User';
import Restaurant from '../models/Restaurant';
import Booking from '../models/Booking';
import Review from '../models/Review';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = express.Router();

/* =========================
   Dashboard Stats
========================= */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const [
      totalUsers,
      totalRestaurants,
      totalBookings,
      totalReviews,
      totalRevenue,
      recentReviews,
    ] = await Promise.all([
      User.countDocuments(),

      Restaurant.countDocuments(),

      Booking.countDocuments({
        status: 'CONFIRMED',
      }),

      Review.countDocuments(),

      Booking.aggregate([
        {
          $match: {
            status: 'CONFIRMED',
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$price',
            },
          },
        },
      ]),

      Review.find()
        .populate('userId', 'name avatar')
        .populate('restaurantId', 'title image')
        .sort('-createdAt')
        .limit(10),
    ]);

    res.json({
      success: true,
      message: 'Dashboard stats fetched successfully',

      data: {
        totalUsers,
        totalRestaurants,
        totalBookings,
        totalReviews,

        totalRevenue: totalRevenue[0]?.total || 0,

        recentReviews,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
    });
  }
});


/* =========================
   Chart Data
========================= */
router.get('/chart-data', authenticateToken, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    );

    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          status: 'CONFIRMED',
          createdAt: {
            $gte: thirtyDaysAgo,
          },
        },
      },

      {
        $group: {
          _id: {
            year: {
              $year: '$createdAt',
            },

            month: {
              $month: '$createdAt',
            },
          },

          total: {
            $sum: '$price',
          },
        },
      },

      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    const categoryStats = await Restaurant.aggregate([
      {
        $group: {
          _id: '$category',
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    res.json({
      success: true,
      message: 'Chart data fetched successfully',

      data: {
        monthlyRevenue,
        categoryStats,
      },
    });
  } catch (error) {
    console.error('Chart data error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch chart data',
    });
  }
});


/* =========================
   All Reviews
========================= */
router.get('/reviews', authenticateToken, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name avatar')
      .populate('restaurantId', 'title image')
      .sort('-createdAt');

    res.json({
      success: true,
      message: 'Reviews fetched successfully',
      data: reviews,
    });
  } catch (error) {
    console.error('Reviews fetch error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
    });
  }
});


export default router;