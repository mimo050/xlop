import { Request, Response } from 'express';
import { CertificateService } from '../services/CertificateService';
import { AppService } from '../services/AppService';
import { OrderService } from '../services/OrderService';
import path from 'path';
import fs from 'fs';

export const PublicController = {
  async home(req: Request, res: Response) {
    const [certificates, apps] = await Promise.all([
      CertificateService.getActiveCertificates(),
      AppService.getActiveApps()
    ]);
    res.render('public/sign', {
      certificates,
      apps,
      prefillUdid: (req.query.udid as string) || ''
    });
  },

  async success(req: Request, res: Response) {
    const order = await OrderService.getOrderById(req.params.orderId);
    if (!order) return res.status(404).render('public/error', { message: 'Order not found' });
    res.render('public/success', { order });
  },

  async download(req: Request, res: Response) {
    const token = req.params.token;
    const order = await OrderService.getOrderByDownloadToken(token);
    if (!order || !order.signedFilePath || !order.downloadExpiresAt || order.downloadExpiresAt < new Date()) {
      return res.status(400).render('public/error', { message: 'Download link invalid or expired' });
    }
    const filePath = order.signedFilePath;
    if (!fs.existsSync(filePath)) {
      return res.status(404).render('public/error', { message: 'File not found' });
    }
    res.download(path.resolve(filePath), path.basename(filePath));
  },

  udidHelp(_req: Request, res: Response) {
    res.render('public/udid-help');
  },

  faq(_req: Request, res: Response) {
    res.render('public/faq');
  },

  terms(_req: Request, res: Response) {
    res.render('public/terms');
  },

  privacy(_req: Request, res: Response) {
    res.render('public/privacy');
  }
};
