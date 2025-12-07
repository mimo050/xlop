import { OrderModel } from '../models/OrderModel';
import { Order } from '@prisma/client';
import { nanoid } from 'nanoid';

export const OrderService = {
  createOrder(data: Partial<Order>) {
    return OrderModel.create({
      udid: data.udid || '',
      email: data.email,
      certificate: { connect: { id: data.certificateId! } },
      app: { connect: { id: data.appId! } },
      status: data.status || 'pending-payment',
      totalAmount: data.totalAmount || 0,
      currency: data.currency || 'USD',
      paymentProvider: data.paymentProvider || 'dummy',
      paymentReference: data.paymentReference,
      signedFilePath: data.signedFilePath,
      downloadToken: data.downloadToken,
      downloadExpiresAt: data.downloadExpiresAt,
      failureReason: data.failureReason
    });
  },
  markPaid(orderId: string, paymentReference?: string) {
    return OrderModel.update(orderId, { status: 'paid', paymentReference });
  },
  markSigning(orderId: string) {
    return OrderModel.update(orderId, { status: 'signing' });
  },
  markCompleted(orderId: string, signedFilePath: string, downloadToken: string, downloadExpiresAt: Date) {
    return OrderModel.update(orderId, {
      status: 'completed',
      signedFilePath,
      downloadToken,
      downloadExpiresAt
    });
  },
  markFailed(orderId: string, reason: string) {
    return OrderModel.update(orderId, { status: 'failed', failureReason: reason });
  },
  getOrderById(orderId: string) {
    return OrderModel.findById(orderId);
  },
  getOrderByDownloadToken(token: string) {
    return OrderModel.findByDownloadToken(token);
  },
  listOrders(params: { skip?: number; take?: number; status?: string }) {
    return OrderModel.list(params);
  },
  countOrders() {
    return OrderModel.count();
  },
  generateDownloadToken() {
    return nanoid(32);
  }
};
