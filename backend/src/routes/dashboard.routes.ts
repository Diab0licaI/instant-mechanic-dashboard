import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protect these routes so only logged-in users can view dashboard data
router.use(authenticate);

router.get('/', dashboardController.getDashboard);
router.get('/analytics', dashboardController.getAnalytics);

export default router;