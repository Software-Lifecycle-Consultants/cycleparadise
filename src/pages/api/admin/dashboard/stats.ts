import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET: APIRoute = async ({ locals }) => {
  // Check authentication
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get total bookings count
    const totalBookings = await prisma.booking.count();

    // Get pending bookings count
    const pendingBookings = await prisma.booking.count({
      where: { status: 'PENDING' },
    });

    // Get active packages count (isActive = true)
    const activePackages = await prisma.tourPackage.count({
      where: { isActive: true },
    });

    // Calculate total revenue from PAID bookings
    const revenueData = await prisma.booking.aggregate({
      where: {
        paymentStatus: 'PAID',
      },
      _sum: {
        totalAmount: true,
      },
    });
    const totalRevenue = revenueData._sum?.totalAmount || 0;

    // Get recent bookings (last 10)
    const recentBookingsData = await prisma.booking.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        package: {
          select: {
            title: true,
          },
        },
      },
    });

    // Format recent bookings for display
    const recentBookings = recentBookingsData.map((booking) => {
      // Split customer name into first and last name (simple split)
      const nameParts = booking.customerName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';
      
      return {
        id: booking.id,
        customerFirstName: firstName,
        customerLastName: lastName,
        customerEmail: booking.customerEmail,
        packageName: booking.package.title,
        tourStartDate: booking.startDate.toISOString(),
        totalAmount: booking.totalAmount,
        status: booking.status,
      };
    });

    return new Response(
      JSON.stringify({
        totalBookings,
        pendingBookings,
        activePackages,
        totalRevenue,
        recentBookings,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to load dashboard statistics' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
