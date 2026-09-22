"use strict";
// import express from 'express';
// import Booking from '../models/Booking';
// import Restaurant from '../models/Restaurant';
// import { authenticateToken } from '../middleware/auth';
// import { z } from 'zod';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// const bookingSchema = z.object({
//   restaurantId: z.string(),
//   quantity: z.number().min(1).default(1),
// });
// /* =========================
//    CREATE BOOKING
// ========================= */
// router.post(
//   '/',
//   authenticateToken,
//   async (req: any, res) => {
//     try {
//       const {
//         restaurantId,
//         quantity,
//       } = bookingSchema.parse(
//         req.body
//       );
//       // Check restaurant
//       const restaurant =
//         await Restaurant.findById(
//           restaurantId
//         );
//       if (!restaurant) {
//         return res.status(404).json({
//           success: false,
//           message:
//             'Restaurant not found',
//         });
//       }
//       // Create booking
//       const booking =
//         await Booking.create({
//           userId: req.user._id,
//           restaurantId,
//           quantity,
//           price:
//             restaurant.price *
//             quantity,
//           status: 'PENDING',
//         });
//       res.status(201).json({
//         success: true,
//         message:
//           'Booking created successfully',
//         data: booking,
//       });
//     } catch (error: any) {
//       console.error(error);
//       if (
//         error instanceof z.ZodError
//       ) {
//         return res.status(400).json({
//           success: false,
//           message:
//             error.errors[0].message,
//         });
//       }
//       res.status(500).json({
//         success: false,
//         message:
//           'Failed to create booking',
//       });
//     }
//   }
// );
// /* =========================
//    GET USER BOOKINGS
// ========================= */
// router.get(
//   '/',
//   authenticateToken,
//   async (req: any, res) => {
//     try {
//       const bookings =
//         await Booking.find({
//           userId: req.user._id,
//         })
//           .populate(
//             'restaurantId',
//             'title image price location'
//           )
//           .sort('-createdAt');
//       res.status(200).json({
//         success: true,
//         message:
//           'Bookings fetched successfully',
//         data: bookings,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         success: false,
//         message:
//           'Failed to fetch bookings',
//       });
//     }
//   }
// );
// /* =========================
//    DELETE BOOKING
// ========================= */
// router.delete(
//   '/:id',
//   authenticateToken,
//   async (req: any, res) => {
//     try {
//       const booking =
//         await Booking.findOneAndDelete({
//           _id: req.params.id,
//           userId: req.user._id,
//         });
//       if (!booking) {
//         return res.status(404).json({
//           success: false,
//           message:
//             'Booking not found',
//         });
//       }
//       res.status(200).json({
//         success: true,
//         message:
//           'Booking cancelled successfully',
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         success: false,
//         message:
//           'Failed to cancel booking',
//       });
//     }
//   }
// );
// export default router;
const express_1 = __importDefault(require("express"));
const Booking_1 = __importDefault(require("../models/Booking"));
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const router = express_1.default.Router();
/* =========================
   VALIDATION
========================= */
const bookingSchema = zod_1.z.object({
    restaurantId: zod_1.z.string(),
    quantity: zod_1.z.number().min(1).default(1),
});
const updateBookingSchema = zod_1.z.object({
    status: zod_1.z.enum([
        'PENDING',
        'CONFIRMED',
        'CANCELLED',
    ]),
});
/* =========================
   CREATE BOOKING
========================= */
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { restaurantId, quantity, } = bookingSchema.parse(req.body);
        // Check restaurant
        const restaurant = await Restaurant_1.default.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found',
            });
        }
        // Create booking
        const booking = await Booking_1.default.create({
            userId: req.user._id,
            restaurantId,
            quantity,
            price: restaurant.price *
                quantity,
            status: 'PENDING',
        });
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking,
        });
    }
    catch (error) {
        console.error(error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message,
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create booking',
        });
    }
});
/* =========================
   GET USER BOOKINGS
========================= */
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const bookings = await Booking_1.default.find({
            userId: req.user._id,
        })
            .populate('restaurantId', 'title image price location')
            .sort('-createdAt');
        res.status(200).json({
            success: true,
            message: 'Bookings fetched successfully',
            data: bookings,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings',
        });
    }
});
/* =========================
   GET SINGLE BOOKING
========================= */
router.get('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const booking = await Booking_1.default.findOne({
            _id: req.params.id,
            userId: req.user._id,
        }).populate('restaurantId', 'title image price location');
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }
        res.status(200).json({
            success: true,
            data: booking,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch booking',
        });
    }
});
/* =========================
   UPDATE BOOKING STATUS
========================= */
router.patch('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { status } = updateBookingSchema.parse(req.body);
        const booking = await Booking_1.default.findOneAndUpdate({
            _id: req.params.id,
            userId: req.user._id,
        }, {
            status,
        }, {
            new: true,
        }).populate('restaurantId', 'title image price location');
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Booking updated successfully',
            data: booking,
        });
    }
    catch (error) {
        console.error(error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message,
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to update booking',
        });
    }
});
/* =========================
   CONFIRM BOOKING
========================= */
router.patch('/:id/confirm', auth_1.authenticateToken, async (req, res) => {
    try {
        const booking = await Booking_1.default.findOneAndUpdate({
            _id: req.params.id,
            userId: req.user._id,
        }, {
            status: 'CONFIRMED',
        }, {
            new: true,
        }).populate('restaurantId', 'title image price location');
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Booking confirmed successfully',
            data: booking,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to confirm booking',
        });
    }
});
/* =========================
   CANCEL BOOKING
========================= */
router.patch('/:id/cancel', auth_1.authenticateToken, async (req, res) => {
    try {
        const booking = await Booking_1.default.findOneAndUpdate({
            _id: req.params.id,
            userId: req.user._id,
        }, {
            status: 'CANCELLED',
        }, {
            new: true,
        }).populate('restaurantId', 'title image price location');
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel booking',
        });
    }
});
/* =========================
   DELETE BOOKING
========================= */
router.delete('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const booking = await Booking_1.default.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Booking deleted successfully',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete booking',
        });
    }
});
exports.default = router;
//# sourceMappingURL=bookings.js.map