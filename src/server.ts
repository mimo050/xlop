import express from 'express';
import path from 'path';
import morgan from 'morgan';
import expressLayouts from 'express-ejs-layouts';
import { env } from './config/env';
import { sessionMiddleware } from './config/session';
import publicRoutes from './routes/public';
import adminRoutes from './routes/admin';
import apiRoutes from './routes/api';
import { errorHandler } from './middleware/errorHandler';
import { AuthService } from './services/AuthService';
import { PaymentController } from './controllers/PaymentController';

const app = express();

const viewsPath = path.resolve(process.cwd(), 'src', 'views');
const publicPath = path.resolve(process.cwd(), 'src', 'public');

app.set('view engine', 'ejs');
app.set('views', viewsPath);
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.static(publicPath));
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

app.use('/', publicRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);
app.get('/payment/dummy/:orderId', PaymentController.dummyCheckout);

app.use(errorHandler);

AuthService.initAdminUser().catch((e) => console.error('Failed to init admin', e));

app.listen(env.port, () => {
  console.log(`Server listening on port ${env.port}`);
});
