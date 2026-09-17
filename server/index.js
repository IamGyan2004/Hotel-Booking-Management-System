import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import hotelRoutes from './routes/hotels.js';
import bookingRoutes from './routes/bookings.js';
import reviewRoutes from './routes/reviews.js';
import adminRoutes from './routes/admin.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'staywise-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use((err, _req, res, _next) => res.status(err.status || 500).json({ message: err.message || 'Server error' }));

async function start() {
  if (!process.env.JWT_SECRET) console.warn('JWT_SECRET is missing; using a development-only secret.');
  if (process.env.MONGO_URI) {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } else {
    console.warn('MONGO_URI is missing; API routes requiring data will be unavailable.');
  }
  app.listen(port, () => console.log(`Staywise API listening on http://localhost:${port}`));
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
