import { Router } from 'express';
import * as mechanicController from '../controllers/mechanic.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate); // Protect all mechanic routes

// GET /api/mechanics
router.get('/', mechanicController.getMechanics);

export default router;