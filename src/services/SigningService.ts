import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { OrderService } from './OrderService';
import { AppService } from './AppService';
import { Order } from '@prisma/client';
import fs from 'fs';

const execFileAsync = promisify(execFile);

export const SigningService = {
  async enqueueSigning(order: Order) {
    await this.signNow(order);
  },

  async signNow(order: Order) {
    await OrderService.markSigning(order.id);
    const app = await AppService.findById(order.appId);
    if (!app) {
      await OrderService.markFailed(order.id, 'App not found');
      return;
    }
    const inputIpa = app.filePath;
    const outputDir = path.resolve(process.cwd(), 'uploads', 'signed');
    const outputIpa = path.join(outputDir, `${order.id}-${app.slug}-signed.ipa`);

    try {
      await execFileAsync(path.resolve(process.cwd(), 'scripts', 'sign_ipa.sh'), [inputIpa, outputIpa, order.udid, order.certificateId]);
      const downloadToken = OrderService.generateDownloadToken();
      const downloadExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await OrderService.markCompleted(order.id, outputIpa, downloadToken, downloadExpiresAt);
    } catch (error: any) {
      console.error('Signing failed', error);
      await OrderService.markFailed(order.id, error?.message || 'Signing failed');
      if (fs.existsSync(outputIpa)) {
        fs.unlinkSync(outputIpa);
      }
    }
  }
};
