import { Router } from 'express';
import * as customerController from '../controllers/customer.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate); // Protect all customer routes with JWT

// GET /api/customers
router.get('/', customerController.getCustomers);

export default router;