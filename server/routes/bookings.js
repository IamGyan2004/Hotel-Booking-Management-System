import { Router } from 'express';
import { Booking, Hotel } from '../models.js';
import { protect } from '../middleware.js';

const router = Router();
router.get('/mine', protect, async (req, res, next) => { try { res.json({ bookings: await Booking.find({ user: req.user._id }).populate('hotel', 'name city images').sort('-createdAt') }); } catch (error) { next(error); } });
router.post('/', protect, async (req, res, next) => {
  try {
    const { hotelId, roomId, checkIn, checkOut, guests } = req.body;
    const hotel = await Hotel.findById(hotelId);
    const room = hotel?.rooms.id(roomId);
    if (!room) return res.status(404).json({ message: 'Hotel room not found' });
    if (new Date(checkOut) <= new Date(checkIn)) return res.status(400).json({ message: 'Check-out must be after check-in' });
    const conflict = await Booking.countDocuments({ hotel: hotelId, room: roomId, status: { $in: ['pending', 'confirmed'] }, checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } });
    if (conflict >= room.totalUnits) return res.status(409).json({ message: 'Room is unavailable for those dates' });
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000);
    const booking = await Booking.create({ user: req.user._id, hotel: hotelId, room: roomId, checkIn, checkOut, guests, totalAmount: nights * room.price });
    res.status(201).json({ booking });
  } catch (error) { next(error); }
});
router.patch('/:id/cancel', protect, async (req, res, next) => { try { const booking = await Booking.findOneAndUpdate({ _id: req.params.id, user: req.user._id, status: { $in: ['pending', 'confirmed'] } }, { status: 'cancelled' }, { new: true }); if (!booking) return res.status(404).json({ message: 'Booking not found or already cancelled' }); res.json({ booking }); } catch (error) { next(error); } });
export default router;
