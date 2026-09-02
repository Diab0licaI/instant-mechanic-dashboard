import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protect this route with our JWT middleware
router.use(authenticate);

// GET /api/bookings
router.get('/', bookingController.getBookings);

export default router;