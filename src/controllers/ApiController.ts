import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { CertificateService } from '../services/CertificateService';
import { AppService } from '../services/AppService';
import { PaymentService } from '../services/PaymentService';

const udidPattern = /^[a-fA-F0-9]{16,64}$/;

export const ApiController = {
  async createOrder(req: Request, res: Response) {
    const { udid, appId, certificateId, email } = req.body;
    if (!udid || !udidPattern.test(udid)) {
      return res.status(400).json({ error: 'Invalid UDID' });
    }
    const [app, cert] = await Promise.all([
      AppService.findById(appId),
      CertificateService.findById(certificateId)
    ]);
    if (!app || app.status !== 'active') return res.status(400).json({ error: 'App not available' });
    if (!cert || cert.status !== 'active') return res.status(400).json({ error: 'Certificate not available' });

    const order = await OrderService.createOrder({
      udid,
      email,
      appId: app.id,
      certificateId: cert.id,
      status: 'pending-payment',
      totalAmount: app.price,
      currency: 'USD',
      paymentProvider: process.env.PAYMENT_PROVIDER || 'dummy'
    });
    const checkout = await PaymentService.createCheckoutSession(order);
    res.json({ checkoutUrl: checkout.checkoutUrl });
  },

  async getOrder(req: Request, res: Response) {
    const order = await OrderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Not found' });
    res.json(order);
  }
};
