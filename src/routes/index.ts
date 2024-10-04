import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import categoryRoutes from './category';
const router = Router();

router.use('/api/v1/auth', authRoutes);
router.use('/api/v1', userRoutes);
router.use('/api/v1', categoryRoutes);
 

export default router;