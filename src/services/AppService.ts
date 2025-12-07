import { App } from '@prisma/client';
import { AppModel } from '../models/AppModel';

export const AppService = {
  getActiveApps(): Promise<App[]> {
    return AppModel.findActive();
  },
  getAllApps(): Promise<App[]> {
    return AppModel.findAll();
  },
  createApp(data: Partial<App>) {
    return AppModel.create({
      displayName: data.displayName || 'New App',
      slug: data.slug || `app-${Date.now()}`,
      version: data.version || '1.0.0',
      bundleId: data.bundleId,
      status: data.status || 'inactive',
      price: data.price || 0,
      filePath: data.filePath || ''
    });
  },
  updateApp(id: string, data: Partial<App>) {
    return AppModel.update(id, data);
  },
  findById(id: string) {
    return AppModel.findById(id);
  }
};
