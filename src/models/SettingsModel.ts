import { prisma } from '../db/client';
import { Settings } from '@prisma/client';

export const SettingsModel = {
  async getAll(): Promise<Settings[]> {
    return prisma.settings.findMany({ orderBy: { key: 'asc' } });
  },
  async upsert(key: string, value: string): Promise<Settings> {
    return prisma.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
  }
};
