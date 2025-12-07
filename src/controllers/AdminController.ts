import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { StatsService } from '../services/StatsService';
import { CertificateService } from '../services/CertificateService';
import { AppService } from '../services/AppService';
import { OrderService } from '../services/OrderService';
import { SettingsModel } from '../models/SettingsModel';
import { SigningService } from '../services/SigningService';
import multer from 'multer';
import path from 'path';

const upload = multer({ dest: path.resolve(process.cwd(), 'uploads', 'ipas') });

export const adminUploadMiddleware = upload.single('ipaFile');

export const AdminController = {
  loginPage(_req: Request, res: Response) {
    res.render('admin/login');
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await AuthService.verifyCredentials(email, password);
    if (!user) {
      return res.render('admin/login', { error: 'Invalid credentials' });
    }
    req.session.userId = user.id;
    res.redirect('/admin');
  },

  logout(req: Request, res: Response) {
    req.session.destroy(() => res.redirect('/admin/login'));
  },

  async dashboard(_req: Request, res: Response) {
    const stats = await StatsService.dashboard();
    res.render('admin/dashboard', { stats });
  },

  async certificates(_req: Request, res: Response) {
    const certificates = await CertificateService.getAllCertificates();
    res.render('admin/certificates', { certificates });
  },

  async createCertificate(req: Request, res: Response) {
    await CertificateService.createCertificate(req.body);
    res.redirect('/admin/certificates');
  },

  async updateCertificate(req: Request, res: Response) {
    await CertificateService.updateCertificate(req.params.id, req.body);
    res.redirect('/admin/certificates');
  },

  async apps(_req: Request, res: Response) {
    const apps = await AppService.getAllApps();
    res.render('admin/apps', { apps });
  },

  async createApp(req: Request, res: Response) {
    const file = (req as any).file;
    const payload = { ...req.body } as any;
    if (file) {
      payload.filePath = file.path;
    }
    await AppService.createApp({
      displayName: payload.displayName,
      slug: payload.slug,
      version: payload.version,
      bundleId: payload.bundleId,
      price: parseInt(payload.price, 10) || 0,
      status: payload.status,
      filePath: payload.filePath
    });
    res.redirect('/admin/apps');
  },

  async updateApp(req: Request, res: Response) {
    const payload = req.body as any;
    if (payload.price) payload.price = parseInt(payload.price, 10);
    await AppService.updateApp(req.params.id, payload);
    res.redirect('/admin/apps');
  },

  async orders(req: Request, res: Response) {
    const orders = await OrderService.listOrders({ take: 50, status: req.query.status as string });
    res.render('admin/orders', { orders });
  },

  async orderShow(req: Request, res: Response) {
    const order = await OrderService.getOrderById(req.params.id);
    if (!order) return res.status(404).render('public/error', { message: 'Order not found' });
    res.render('admin/order-show', { order });
  },

  async retrySigning(req: Request, res: Response) {
    const order = await OrderService.getOrderById(req.params.id);
    if (order) {
      await SigningService.enqueueSigning(order as any);
    }
    res.redirect(`/admin/orders/${req.params.id}`);
  },

  async settings(_req: Request, res: Response) {
    const settings = await SettingsModel.getAll();
    res.render('admin/settings', { settings });
  },

  async updateSettings(req: Request, res: Response) {
    const entries = Object.entries(req.body);
    await Promise.all(entries.map(([key, value]) => SettingsModel.upsert(key, value as string)));
    res.redirect('/admin/settings');
  }
};
