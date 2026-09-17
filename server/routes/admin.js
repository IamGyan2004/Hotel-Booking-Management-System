import { Router } from 'express';
import { Booking, Hotel, User } from '../models.js';
import { adminOnly, protect } from '../middleware.js';

const router = Router();
router.use(protect, adminOnly);
router.get('/dashboard', async (_req, res, next) => { try { const [users, hotels, bookings, revenue] = await Promise.all([User.countDocuments(), Hotel.countDocuments(), Booking.countDocuments(), Booking.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }])]); res.json({ stats: { users, hotels, bookings, revenue: revenue[0]?.total || 0 } }); } catch (error) { next(error); } });
router.get('/bookings', async (_req, res, next) => { try { res.json({ bookings: await Booking.find().populate('user', 'name email').populate('hotel', 'name city').sort('-createdAt') }); } catch (error) { next(error); } });
router.patch('/bookings/:id', async (req, res, next) => { try { res.json({ booking: await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }) }); } catch (error) { next(error); } });
export default router;
