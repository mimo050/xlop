import { Router } from 'express';
import { ApiController } from '../controllers/ApiController';
import { PaymentController } from '../controllers/PaymentController';

const router = Router();

router.post('/orders', ApiController.createOrder);
router.get('/orders/:id', ApiController.getOrder);
router.post('/payments/webhook', PaymentController.webhook);

export default router;
