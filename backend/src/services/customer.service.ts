import prisma from '../utils/prisma';

export const getAllCustomers = async (
  page: number, 
  limit: number, 
  search: string
) => {
  const skip = (page - 1) * limit;

  // Build dynamic search query (searching by name, email, or phone)
  const whereClause: any = {};
  
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } }
    ];
  }

  // Fetch customers along with a count of their vehicles and bookings
  const [customers, totalCount] = await Promise.all([
    prisma.customer.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }, // Newest customers first
      include: {
        _count: {
          select: { vehicles: true, bookings: true }
        }
      }
    }),
    prisma.customer.count({ where: whereClause })
  ]);

  return {
    data: customers,
    meta: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    }
  };
};