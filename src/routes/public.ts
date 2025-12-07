import { Router } from 'express';
import { PublicController } from '../controllers/PublicController';

const router = Router();

router.get('/', PublicController.home);
router.get('/success/:orderId', PublicController.success);
router.get('/download/:token', PublicController.download);
router.get('/udid-help', PublicController.udidHelp);
router.get('/faq', PublicController.faq);
router.get('/terms', PublicController.terms);
router.get('/privacy', PublicController.privacy);

export default router;
