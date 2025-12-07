import { env } from '../config/env';
import { OrderService } from './OrderService';
import { SigningService } from './SigningService';

export const PaymentService = {
  async createCheckoutSession(order: { id: string; paymentProvider: string }) {
    if (env.paymentProvider === 'dummy') {
      return { checkoutUrl: `/payment/dummy/${order.id}` };
    }
    // Stripe placeholder
    return { checkoutUrl: `/payment/dummy/${order.id}` };
  },

  async handleWebhook(payload: any, headers: any) {
    // In real integration, verify provider signature
    console.log('Received webhook', payload, headers);
    if (payload?.type === 'payment_intent.succeeded' && payload.data?.object?.metadata?.orderId) {
      const orderId = payload.data.object.metadata.orderId as string;
      const order = await OrderService.getOrderById(orderId);
      if (order) {
        await OrderService.markPaid(order.id, payload.data.object.id);
        await SigningService.enqueueSigning(order);
      }
    }
  }
};
