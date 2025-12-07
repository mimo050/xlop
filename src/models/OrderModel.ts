import { prisma } from '../db/client';
import { Order, Prisma } from '@prisma/client';

export const OrderModel = {
  create(data: Prisma.OrderCreateInput): Promise<Order> {
    return prisma.order.create({ data });
  },
  update(id: string, data: Prisma.OrderUpdateInput): Promise<Order> {
    return prisma.order.update({ where: { id }, data });
  },
  findById(id: string) {
    return prisma.order.findUnique({ where: { id }, include: { app: true, certificate: true } });
  },
  findByDownloadToken(token: string) {
    return prisma.order.findFirst({ where: { downloadToken: token }, include: { app: true, certificate: true } });
  },
  list(params: { skip?: number; take?: number; status?: string }) {
    return prisma.order.findMany({
      skip: params.skip,
      take: params.take,
      where: params.status ? { status: params.status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { app: true, certificate: true }
    });
  },
  count() {
    return prisma.order.count();
  }
};
