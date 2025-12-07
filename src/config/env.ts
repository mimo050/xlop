import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  sessionSecret: process.env.SESSION_SECRET || 'change-me',
  databaseUrl: process.env.DATABASE_URL || '',
  paymentProvider: process.env.PAYMENT_PROVIDER || 'dummy',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@local.test',
  adminPassword: process.env.ADMIN_PASSWORD || 'ChangeMe123!'
};
