"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const zod_1 = require("zod");
const router = express_1.default.Router();
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
// Demo users
const DEMO_USERS = {
    user: { email: 'user@test.com', password: '123456' },
    admin: { email: 'admin@test.com', password: '123456' }
};
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = registerSchema.parse(req.body);
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new User_1.default({ name, email, password: hashedPassword });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            success: true,
            message: 'User registered successfully',
            data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token }
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, message: error.errors[0].message });
        }
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const user = await User_1.default.findOne({ email });
        if (!user || !await bcryptjs_1.default.compare(password, user.password)) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            success: true,
            message: 'Login successful',
            data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token }
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, message: error.errors[0].message });
        }
        res.status(500).json({ success: false, message: 'Login failed' });
    }
});
// Demo login buttons
router.post('/demo-login/:role', (req, res) => {
    const { role } = req.params;
    const demoUser = DEMO_USERS[role];
    if (!demoUser) {
        return res.status(400).json({ success: false, message: 'Invalid demo role' });
    }
    // In real app, this would login with demo credentials
    res.json({
        success: true,
        message: `Demo ${role} login successful`,
        data: {
            user: { name: role === 'admin' ? 'Admin User' : 'Demo User', email: demoUser.email, role: role.toUpperCase() },
            token: 'demo-token'
        }
    });
});
exports.default = router;
//# sourceMappingURL=auth.js.map