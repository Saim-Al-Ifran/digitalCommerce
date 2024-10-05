import { Router } from 'express';
import { addProduct } from '../controllers/product/product';
import authenticate from '../middlewares/auth/authenticate';
import authorizeAdmin from '../middlewares/auth/authorizeAdmin';
import upload from '../middlewares/uploadFile/uploadFile';
 

const router = Router();

// POST /products - Add a new product
router.post('/products',authenticate,authorizeAdmin,upload.single('image'),addProduct);


export default router;
