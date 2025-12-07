import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { SigningService } from '../services/SigningService';

export const SigningController = {
  async retry(req: Request, res: Response) {
    const order = await OrderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    await SigningService.enqueueSigning(order as any);
    res.json({ status: 'queued' });
  }
};
