"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const router = express_1.default.Router();
const createSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    description: zod_1.z.string().min(10),
    image: zod_1.z.string().url(),
    price: zod_1.z.number().positive(),
    location: zod_1.z.string().min(3),
    category: zod_1.z.enum(['Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'American']),
    cuisine: zod_1.z.array(zod_1.z.string())
});
// GET /api/restaurants - Search, Filter, Sort, Pagination
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 12, search, category, priceMin, priceMax, rating, sort = '-createdAt' } = req.query;
        const query = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }
        if (category)
            query.category = category;
        if (priceMin || priceMax) {
            query.price = {};
            if (priceMin)
                query.price.$gte = Number(priceMin);
            if (priceMax)
                query.price.$lte = Number(priceMax);
        }
        if (rating)
            query.rating = { $gte: Number(rating) };
        const skip = (Number(page) - 1) * Number(limit);
        const total = await Restaurant_1.default.countDocuments(query);
        const restaurants = await Restaurant_1.default.find(query)
            .sort(sort)
            .limit(Number(limit))
            .skip(skip)
            .populate('createdBy', 'name avatar');
        res.json({
            success: true,
            message: 'Restaurants fetched successfully',
            data: restaurants,
            meta: { page: Number(page), limit: Number(limit), total }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch restaurants' });
    }
});
// GET /api/restaurants/:id
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant_1.default.findById(req.params.id).populate('createdBy', 'name avatar');
        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found' });
        }
        res.json({ success: true, message: 'Restaurant fetched successfully', data: restaurant });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch restaurant' });
    }
});
// POST /api/restaurants - Create (Admin only)
router.post('/', auth_1.authenticateToken, (0, auth_1.authorizeRole)(['ADMIN']), async (req, res) => {
    try {
        const data = createSchema.parse(req.body);
        data.createdBy = req.user._id;
        const restaurant = new Restaurant_1.default(data);
        await restaurant.save();
        res.status(201).json({
            success: true,
            message: 'Restaurant created successfully',
            data: restaurant
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, message: error.errors[0].message });
        }
        res.status(500).json({ success: false, message: 'Failed to create restaurant' });
    }
});
exports.default = router;
//# sourceMappingURL=restaurants.js.map