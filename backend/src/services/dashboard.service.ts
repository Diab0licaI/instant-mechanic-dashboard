import prisma from '../utils/prisma';
import { BookingStatus, PaymentStatus } from '@prisma/client';

export const getDashboardKPIs = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Run queries concurrently for performance
  const [
    totalBookings,
    todayBookings,
    statusCounts,
    revenueAgg,
    activeMechanics,
    newCustomers
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { createdAt: { gte: today } } }),
    prisma.booking.groupBy({ by: ['status'], _count: { status: true } }),
    prisma.payment.aggregate({ 
      _sum: { amount: true }, 
      where: { status: PaymentStatus.COMPLETED } 
    }),
    prisma.mechanic.count({ 
      where: { status: { in: ['AVAILABLE', 'BUSY'] } } 
    }),
    prisma.customer.count({ where: { createdAt: { gte: today } } })
  ]);

  // Format status counts
  const getCount = (status: BookingStatus) => 
    statusCounts.find(s => s.status === status)?._count.status || 0;

  return {
    totalBookings,
    todayBookings,
    completedBookings: getCount(BookingStatus.COMPLETED),
    pendingBookings: getCount(BookingStatus.PENDING),
    cancelledBookings: getCount(BookingStatus.CANCELLED),
    totalRevenue: revenueAgg._sum.amount || 0,
    activeMechanics,
    newCustomers,
  };
};

export const getDashboardAnalytics = async () => {
  // Service category breakdown for charts
  const categoryBreakdown = await prisma.service.findMany({
    select: {
      category: true,
      _count: { select: { bookings: true } }
    }
  });

  const formattedCategories = categoryBreakdown.map(c => ({
    name: c.category,
    value: c._count.bookings
  }));

  return {
    serviceCategories: formattedCategories
  };
};