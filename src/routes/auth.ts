import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { z } from 'zod';

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Demo users
const DEMO_USERS = {
  user: { email: 'user@test.com', password: '123456' },
  admin: { email: 'admin@test.com', password: '123456' }
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    
    res.json({
      success: true,
      message: 'User registered successfully',
      data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    
    res.json({
      success: true,
      message: 'Login successful',
      data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Demo login buttons
router.post('/demo-login/:role', (req, res) => {
  const { role } = req.params;
  const demoUser = DEMO_USERS[role as keyof typeof DEMO_USERS];
  
  if (!demoUser) {
    return res.status(400).json({ success: false, message: 'Invalid demo role' });
  }
  
  // In real app, this would login with demo credentials
  res.json({
    success: true,
    message: `Demo ${role} login successful`,
    data: {
      user: { name: role === 'admin' ? 'Admin User' : 'Demo User', email: demoUser.email, role: role.toUpperCase() as any },
      token: 'demo-token'
    }
  });
});

export default router;