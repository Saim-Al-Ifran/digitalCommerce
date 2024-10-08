import express from 'express';
import { deleteUser, getAllUsers, toggleActivation } from '../controllers/user/user';
import authenticate from '../middlewares/auth/authenticate';
import authorizeAdmin from '../middlewares/auth/authorizeAdmin'; 
const router = express.Router();

//admin routes
router.get('/users',authenticate,authorizeAdmin,getAllUsers);
router.delete('/users/:id',authenticate,authorizeAdmin,deleteUser);
router.patch('/users/:id/toggle-activation', authenticate, authorizeAdmin, toggleActivation);

export default router;