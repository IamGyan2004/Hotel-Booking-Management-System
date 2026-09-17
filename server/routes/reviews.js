import { Router } from 'express';
import { Hotel, Review } from '../models.js';
import { protect } from '../middleware.js';

const router = Router();
router.get('/hotel/:hotelId', async (req, res, next) => { try { res.json({ reviews: await Review.find({ hotel: req.params.hotelId }).populate('user', 'name').sort('-createdAt') }); } catch (error) { next(error); } });
router.post('/', protect, async (req, res, next) => { try { const review = await Review.create({ ...req.body, user: req.user._id }); const stats = await Review.aggregate([{ $match: { hotel: review.hotel } }, { $group: { _id: '$hotel', rating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }]); await Hotel.findByIdAndUpdate(review.hotel, stats[0] || {}); res.status(201).json({ review }); } catch (error) { next(error); } });
export default router;
