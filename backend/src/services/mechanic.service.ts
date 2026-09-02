import prisma from '../utils/prisma';
import { MechanicStatus } from '@prisma/client';

export const getAllMechanics = async (
  page: number, 
  limit: number, 
  search: string, 
  status?: MechanicStatus
) => {
  const skip = (page - 1) * limit;

  // Build dynamic search/filter query
  const whereClause: any = {};
  
  if (status) {
    whereClause.status = status;
  }
  
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } }
    ];
  }

  // Fetch mechanics and their current active bookings count
  const [mechanics, totalCount] = await Promise.all([
    prisma.mechanic.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { bookings: true }
        }
      }
    }),
    prisma.mechanic.count({ where: whereClause })
  ]);

  return {
    data: mechanics,
    meta: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    }
  };
};