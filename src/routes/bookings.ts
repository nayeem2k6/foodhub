

// import express from 'express';
// import Booking from '../models/Booking';
// import Restaurant from '../models/Restaurant';
// import { authenticateToken } from '../middleware/auth';
// import { z } from 'zod';

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


// import express from 'express';
// import Booking from '../models/Booking';
// import Restaurant from '../models/Restaurant';
// import { authenticateToken } from '../middleware/auth';
// import { z } from 'zod';

// const router = express.Router();

// /* =========================
//    VALIDATION
// ========================= */

// const bookingSchema = z.object({
//   restaurantId: z.string(),
//   quantity: z.number().min(1).default(1),
// });

// const updateBookingSchema = z.object({
//   status: z.enum([
//     'PENDING',
//     'CONFIRMED',
//     'CANCELLED',
//   ]),
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
//       } = bookingSchema.parse(req.body);

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
//    GET SINGLE BOOKING
// ========================= */

// router.get(
//   '/:id',
//   authenticateToken,
//   async (req: any, res) => {
//     try {
//       const booking =
//         await Booking.findOne({
//           _id: req.params.id,
//           userId: req.user._id,
//         }).populate(
//           'restaurantId',
//           'title image price location'
//         );

//       if (!booking) {
//         return res.status(404).json({
//           success: false,
//           message:
//             'Booking not found',
//         });
//       }

//       res.status(200).json({
//         success: true,
//         data: booking,
//       });
//     } catch (error) {
//       console.error(error);

//       res.status(500).json({
//         success: false,
//         message:
//           'Failed to fetch booking',
//       });
//     }
//   }
// );

// /* =========================
//    UPDATE BOOKING STATUS
// ========================= */

// router.patch(
//   '/:id',
//   authenticateToken,
//   async (req: any, res) => {
//     try {
//       const { status } =
//         updateBookingSchema.parse(
//           req.body
//         );

//       const booking =
//         await Booking.findOneAndUpdate(
//           {
//             _id: req.params.id,
//             userId: req.user._id,
//           },
//           {
//             status,
//           },
//           {
//             new: true,
//           }
//         ).populate(
//           'restaurantId',
//           'title image price location'
//         );

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
//           'Booking updated successfully',
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
//           'Failed to update booking',
//       });
//     }
//   }
// );

// /* =========================
//    CONFIRM BOOKING
// ========================= */

// router.patch(
//   '/:id/confirm',
//   authenticateToken,
//   async (req: any, res) => {
//     try {
//       const booking =
//         await Booking.findOneAndUpdate(
//           {
//             _id: req.params.id,
//             userId: req.user._id,
//           },
//           {
//             status: 'CONFIRMED',
//           },
//           {
//             new: true,
//           }
//         ).populate(
//           'restaurantId',
//           'title image price location'
//         );

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
//           'Booking confirmed successfully',
//         data: booking,
//       });
//     } catch (error) {
//       console.error(error);

//       res.status(500).json({
//         success: false,
//         message:
//           'Failed to confirm booking',
//       });
//     }
//   }
// );

// /* =========================
//    CANCEL BOOKING
// ========================= */

// router.patch(
//   '/:id/cancel',
//   authenticateToken,
//   async (req: any, res) => {
//     try {
//       const booking =
//         await Booking.findOneAndUpdate(
//           {
//             _id: req.params.id,
//             userId: req.user._id,
//           },
//           {
//             status: 'CANCELLED',
//           },
//           {
//             new: true,
//           }
//         ).populate(
//           'restaurantId',
//           'title image price location'
//         );

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
//         data: booking,
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
//           'Booking deleted successfully',
//       });
//     } catch (error) {
//       console.error(error);

//       res.status(500).json({
//         success: false,
//         message:
//           'Failed to delete booking',
//       });
//     }
//   }
// );

// export default router;


import express from 'express';
import Booking from '../models/Booking';
import Restaurant from '../models/Restaurant';
import { authenticateToken } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();

/* =========================
   VALIDATION
========================= */

const bookingSchema = z.object({
  restaurantId: z.string(),
  quantity: z.number().min(1).default(1),
});

const updateBookingSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
  ]),
});

/* =========================
   CREATE BOOKING
========================= */

router.post(
  '/',
  authenticateToken,
  async (req, res) => {
    try {
      const {
        restaurantId,
        quantity,
      } = bookingSchema.parse(req.body);

      // Check restaurant
      const restaurant =
        await Restaurant.findById(
          restaurantId
        );

      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message:
            'Restaurant not found',
        });
      }

      // Create booking
      const booking =
        await Booking.create({
          userId: req.user!._id,
          restaurantId,
          quantity,
          price:
            restaurant.price *
            quantity,
          status: 'PENDING',
        });

      res.status(201).json({
        success: true,
        message:
          'Booking created successfully',
        data: booking,
      });
    } catch (error: any) {
      console.error(error);

      if (
        error instanceof z.ZodError
      ) {
        return res.status(400).json({
          success: false,
          message:
            error.errors[0].message,
        });
      }

      res.status(500).json({
        success: false,
        message:
          'Failed to create booking',
      });
    }
  }
);

/* =========================
   GET USER BOOKINGS
========================= */

router.get(
  '/',
  authenticateToken,
  async (req, res) => {
    try {
      const bookings =
        await Booking.find({
          userId: req.user!._id,
        })
          .populate(
            'restaurantId',
            'title image price location'
          )
          .sort('-createdAt');

      res.status(200).json({
        success: true,
        message:
          'Bookings fetched successfully',
        data: bookings,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Failed to fetch bookings',
      });
    }
  }
);

/* =========================
   GET SINGLE BOOKING
========================= */

router.get(
  '/:id',
  authenticateToken,
  async (req, res) => {
    try {
      const booking =
        await Booking.findOne({
          _id: req.params.id,
          userId: req.user!._id,
        }).populate(
          'restaurantId',
          'title image price location'
        );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message:
            'Booking not found',
        });
      }

      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Failed to fetch booking',
      });
    }
  }
);

/* =========================
   UPDATE BOOKING STATUS
========================= */

router.patch(
  '/:id',
  authenticateToken,
  async (req, res) => {
    try {
      const { status } =
        updateBookingSchema.parse(
          req.body
        );

      const booking =
        await Booking.findOneAndUpdate(
          {
            _id: req.params.id,
            userId: req.user!._id,
          },
          {
            status,
          },
          {
            new: true,
          }
        ).populate(
          'restaurantId',
          'title image price location'
        );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message:
            'Booking not found',
        });
      }

      res.status(200).json({
        success: true,
        message:
          'Booking updated successfully',
        data: booking,
      });
    } catch (error: any) {
      console.error(error);

      if (
        error instanceof z.ZodError
      ) {
        return res.status(400).json({
          success: false,
          message:
            error.errors[0].message,
        });
      }

      res.status(500).json({
        success: false,
        message:
          'Failed to update booking',
      });
    }
  }
);

/* =========================
   CONFIRM BOOKING
========================= */

router.patch(
  '/:id/confirm',
  authenticateToken,
  async (req, res) => {
    try {
      const booking =
        await Booking.findOneAndUpdate(
          {
            _id: req.params.id,
            userId: req.user!._id,
          },
          {
            status: 'CONFIRMED',
          },
          {
            new: true,
          }
        ).populate(
          'restaurantId',
          'title image price location'
        );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message:
            'Booking not found',
        });
      }

      res.status(200).json({
        success: true,
        message:
          'Booking confirmed successfully',
        data: booking,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Failed to confirm booking',
      });
    }
  }
);

/* =========================
   CANCEL BOOKING
========================= */

router.patch(
  '/:id/cancel',
  authenticateToken,
  async (req, res) => {
    try {
      const booking =
        await Booking.findOneAndUpdate(
          {
            _id: req.params.id,
            userId: req.user!._id,
          },
          {
            status: 'CANCELLED',
          },
          {
            new: true,
          }
        ).populate(
          'restaurantId',
          'title image price location'
        );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message:
            'Booking not found',
        });
      }

      res.status(200).json({
        success: true,
        message:
          'Booking cancelled successfully',
        data: booking,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Failed to cancel booking',
      });
    }
  }
);

/* =========================
   DELETE BOOKING
========================= */

router.delete(
  '/:id',
  authenticateToken,
  async (req, res) => {
    try {
      const booking =
        await Booking.findOneAndDelete({
          _id: req.params.id,
          userId: req.user!._id,
        });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message:
            'Booking not found',
        });
      }

      res.status(200).json({
        success: true,
        message:
          'Booking deleted successfully',
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Failed to delete booking',
      });
    }
  }
);

export default router;