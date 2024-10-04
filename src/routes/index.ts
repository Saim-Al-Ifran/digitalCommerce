import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
const router = Router();

router.use('/api/v1/auth', authRoutes);
router.use('/api/v1', userRoutes);
 

export default router;