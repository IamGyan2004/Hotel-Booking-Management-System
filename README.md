# Staywise Hotel Booking System

Staywise is a MERN hotel reservation platform with a responsive React dashboard and an Express REST API. The client supports discovery, recommendation-style filtering, saved stays, booking feedback, itinerary preview, and travel insights. The API provides the production boundaries for authentication, hotel and room management, availability checks, bookings, cancellations, reviews, and admin operations.

## Run locally

```bash
npm install
cp .env.example .env
# Set MONGO_URI and JWT_SECRET in .env
npm run fullstack
```

Frontend: `http://localhost:5173`  
API: `http://localhost:5000`  
Health check: `http://localhost:5000/api/health`

## Implemented REST endpoints

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/hotels` with city, guest, price, and sort filters
- Admin-protected hotel CRUD at `/api/hotels`
- `POST /api/bookings` with date overlap availability protection
- `GET /api/bookings/mine` and `PATCH /api/bookings/:id/cancel`
- `GET /api/reviews/hotel/:hotelId` and `POST /api/reviews`
- Admin dashboard and booking moderation at `/api/admin`

## Service integrations

MongoDB is connected through Mongoose. Set `CLOUDINARY_*`, `STRIPE_*` or `RAZORPAY_*`, and SMTP/email variables when adding production upload, payment, and confirmation adapters. The API intentionally runs without those optional credentials for local UI and endpoint development, while authentication uses the required `JWT_SECRET` in normal deployments.