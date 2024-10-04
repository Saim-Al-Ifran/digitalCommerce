import express from 'express';
const router = express.Router();
import {adminLogin, refreshTokenController, register, userLogin} from '../controllers/user/auth';

// User Registration
router.post('/register',register);

// User Login
router.post('/login', userLogin);

// Admin Login
router.post('/admin/login',adminLogin);

router.post('/refresh-token',refreshTokenController);
 

export default router;