import prisma from '../utils/prisma';
import { BookingStatus } from '@prisma/client';

export const getAllBookings = async (
  page: number, 
  limit: number, 
  search: string, 
  status?: BookingStatus
) => {
  const skip = (page - 1) * limit;

  // Build a dynamic search query
  const whereClause: any = {};
  
  if (status) {
    whereClause.status = status;
  }
  
  if (search) {
    whereClause.OR = [
      { customer: { name: { contains: search, mode: 'insensitive' } } },
      { customer: { phone: { contains: search, mode: 'insensitive' } } },
      { vehicle: { registrationNumber: { contains: search, mode: 'insensitive' } } }
    ];
  }

  // Run the data fetch and the total count simultaneously for speed
  const [bookings, totalCount] = await Promise.all([
    prisma.booking.findMany({
      where: whereClause,
      skip: skip,
      take: limit,
      orderBy: { scheduledDate: 'desc' }, // Newest first
      include: {
        customer: { select: { name: true, phone: true } },
        vehicle: { select: { make: true, model: true, registrationNumber: true } },
        service: { select: { name: true, price: true } },
        mechanic: { select: { name: true } }
      }
    }),
    prisma.booking.count({ where: whereClause })
  ]);

  return {
    data: bookings,
    meta: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    }
  };
};