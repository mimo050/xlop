import { prisma } from '../db/client';

export const StatsService = {
  async dashboard() {
    const [totalOrders, completedOrders, failedOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'completed' } }),
      prisma.order.count({ where: { status: 'failed' } })
    ]);

    const revenueLast7Days = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: 'completed',
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }
    });

    const topApps = await prisma.order.groupBy({
      by: ['appId'],
      _count: { appId: true },
      orderBy: { _count: { appId: 'desc' } },
      take: 5
    });

    return {
      totalOrders,
      completedOrders,
      failedOrders,
      revenueLast7Days: revenueLast7Days._sum.totalAmount || 0,
      topApps
    };
  }
};
