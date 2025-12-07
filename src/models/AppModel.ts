import { prisma } from '../db/client';
import { App, Prisma } from '@prisma/client';

export const AppModel = {
  findActive(): Promise<App[]> {
    return prisma.app.findMany({ where: { status: 'active' }, orderBy: { createdAt: 'desc' } });
  },
  findAll(): Promise<App[]> {
    return prisma.app.findMany({ orderBy: { createdAt: 'desc' } });
  },
  create(data: Prisma.AppCreateInput): Promise<App> {
    return prisma.app.create({ data });
  },
  update(id: string, data: Prisma.AppUpdateInput): Promise<App> {
    return prisma.app.update({ where: { id }, data });
  },
  findById(id: string): Promise<App | null> {
    return prisma.app.findUnique({ where: { id } });
  }
};
