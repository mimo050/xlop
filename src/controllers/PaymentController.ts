import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { SigningService } from '../services/SigningService';
import { PaymentService } from '../services/PaymentService';

export const PaymentController = {
  async dummyCheckout(req: Request, res: Response) {
    const order = await OrderService.getOrderById(req.params.orderId);
    if (!order) return res.status(404).render('public/error', { message: 'Order not found' });
    await OrderService.markPaid(order.id, 'dummy-payment');
    await SigningService.enqueueSigning(order as any);
    res.redirect(`/success/${order.id}`);
  },

  async webhook(req: Request, res: Response) {
    await PaymentService.handleWebhook(req.body, req.headers);
    res.json({ received: true });
  }
};
