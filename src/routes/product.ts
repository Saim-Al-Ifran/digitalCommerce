import { Router } from 'express';
import { addProduct, getAllProducts, getProductById } from '../controllers/product/product';
import authenticate from '../middlewares/auth/authenticate';
import authorizeAdmin from '../middlewares/auth/authorizeAdmin';
import upload from '../middlewares/uploadFile/uploadFile';
const router = Router();

router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
// Admin routes
router.post('/products',authenticate,authorizeAdmin,upload.single('image'),addProduct);


export default router;
