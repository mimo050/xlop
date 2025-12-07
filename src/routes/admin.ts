import { Router } from 'express';
import { AdminController, adminUploadMiddleware } from '../controllers/AdminController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/login', AdminController.loginPage);
router.post('/login', AdminController.login);
router.post('/logout', requireAuth, AdminController.logout);

router.get('/', requireAuth, AdminController.dashboard);

router.get('/certificates', requireAuth, AdminController.certificates);
router.post('/certificates', requireAuth, AdminController.createCertificate);
router.post('/certificates/:id', requireAuth, AdminController.updateCertificate);

router.get('/apps', requireAuth, AdminController.apps);
router.post('/apps', requireAuth, adminUploadMiddleware, AdminController.createApp);
router.post('/apps/:id', requireAuth, AdminController.updateApp);

router.get('/orders', requireAuth, AdminController.orders);
router.get('/orders/:id', requireAuth, AdminController.orderShow);
router.post('/orders/:id/retry-signing', requireAuth, AdminController.retrySigning);

router.get('/settings', requireAuth, AdminController.settings);
router.post('/settings', requireAuth, AdminController.updateSettings);

export default router;
