import express from 'express';
import Restaurant from '../models/Restaurant';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();

const createSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  image: z.string().url(),
  price: z.number().positive(),
  location: z.string().min(3),
  category: z.enum(['Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'American']),
  cuisine: z.array(z.string())
});

// GET /api/restaurants - Search, Filter, Sort, Pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      priceMin,
      priceMax,
      rating,
      sort = '-createdAt'
    } = req.query;

    const query: any = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) query.category = category;
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }
    if (rating) query.rating = { $gte: Number(rating) };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Restaurant.countDocuments(query);
    
    const restaurants = await Restaurant.find(query)
      .sort(sort as any)
      .limit(Number(limit))
      .skip(skip)
      .populate('createdBy', 'name avatar');

    res.json({
      success: true,
      message: 'Restaurants fetched successfully',
      data: restaurants,
      meta: { page: Number(page), limit: Number(limit), total }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch restaurants' });
  }
});

// GET /api/restaurants/:id
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('createdBy', 'name avatar');
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    res.json({ success: true, message: 'Restaurant fetched successfully', data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch restaurant' });
  }
});

// POST /api/restaurants - Create (Admin only)
router.post('/', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const data = createSchema.parse(req.body);
    data.createdBy = req.user!._id;
    
    const restaurant = new Restaurant(data);
    await restaurant.save();
    
    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: restaurant
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    res.status(500).json({ success: false, message: 'Failed to create restaurant' });
  }
});

export default router;