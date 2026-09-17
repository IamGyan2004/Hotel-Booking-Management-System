import { Router } from 'express';
import { Hotel } from '../models.js';
import { adminOnly, protect } from '../middleware.js';

const router = Router();
router.get('/', async (req, res, next) => {
  try {
    const { city, guests, maxPrice, sort = '-rating' } = req.query;
    const query = city && city !== 'Anywhere' ? { city: new RegExp(city, 'i') } : {};
    if (guests) query['rooms.capacity'] = { $gte: Number(guests) };
    if (maxPrice) query['rooms.price'] = { $lte: Number(maxPrice) };
    const hotels = await Hotel.find(query).sort(sort === 'price' ? { 'rooms.price': 1 } : sort === 'rating' ? { rating: -1 } : { createdAt: -1 });
    res.json({ hotels });
  } catch (error) { next(error); }
});
router.get('/:id', async (req, res, next) => { try { res.json({ hotel: await Hotel.findById(req.params.id) }); } catch (error) { next(error); } });
router.post('/', protect, adminOnly, async (req, res, next) => { try { res.status(201).json({ hotel: await Hotel.create(req.body) }); } catch (error) { next(error); } });
router.patch('/:id', protect, adminOnly, async (req, res, next) => { try { res.json({ hotel: await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }) }); } catch (error) { next(error); } });
router.delete('/:id', protect, adminOnly, async (req, res, next) => { try { await Hotel.findByIdAndDelete(req.params.id); res.status(204).end(); } catch (error) { next(error); } });
export default router;
