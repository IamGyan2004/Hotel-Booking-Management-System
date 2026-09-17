import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  amenities: [String],
  images: [String],
  totalUnits: { type: Number, default: 1, min: 1 },
});

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  city: { type: String, required: true, index: true },
  country: String,
  address: String,
  images: [String],
  amenities: [String],
  rooms: [roomSchema],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true, min: 1 },
  totalAmount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
  paymentProvider: String,
  paymentId: String,
}, { timestamps: true });

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true },
}, { timestamps: true });
reviewSchema.index({ user: 1, hotel: 1 }, { unique: true });

export const User = mongoose.model('User', userSchema);
export const Hotel = mongoose.model('Hotel', hotelSchema);
export const Booking = mongoose.model('Booking', bookingSchema);
export const Review = mongoose.model('Review', reviewSchema);
