import { Request, Response, NextFunction } from 'express';
import * as bookingService from '../services/booking.service';
import { BookingStatus } from '@prisma/client';

export const getBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract query parameters with defaults
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const status = req.query.status as BookingStatus | undefined;

    const result = await bookingService.getAllBookings(page, limit, search, status);
    
    res.status(200).json({ 
      success: true, 
      data: result.data, 
      meta: result.meta 
    });
  } catch (error) {
    next(error); // Passes errors to our centralized error handler
  }
};