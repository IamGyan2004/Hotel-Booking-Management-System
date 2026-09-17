import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models.js';
import { protect } from '../middleware.js';

const router = Router();
const tokenFor = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'staywise-development-secret', { expiresIn: '7d' });
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) return res.status(400).json({ message: 'Name, email, and an 8-character password are required' });
    if (await User.exists({ email })) return res.status(409).json({ message: 'Email is already registered' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: tokenFor(user), user: publicUser(user) });
  } catch (error) { next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select('+password');
    if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ token: tokenFor(user), user: publicUser(user) });
  } catch (error) { next(error); }
});

router.get('/me', protect, (req, res) => res.json({ user: publicUser(req.user) }));
export default router;
