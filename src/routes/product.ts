import { Router } from 'express';
import {
    addProduct,
    deleteProductById,
    getAllProducts,
    getLowInventoryProducts,
    getProductById,
    getProductsByCategory,
    updateProductById
} from '../controllers/product/product';
import authenticate from '../middlewares/auth/authenticate';
import authorizeAdmin from '../middlewares/auth/authorizeAdmin';
import upload from '../middlewares/uploadFile/uploadFile';
const router = Router();

//public routes
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.get('/products/category/:category', getProductsByCategory);
router.get('/products/inventory/low', getLowInventoryProducts);

// Admin routes
router.post('/products',authenticate,authorizeAdmin,upload.single('image'),addProduct);
router.put('/products/:id',authenticate,authorizeAdmin,upload.single('image'),updateProductById);
router.delete('/products/:id',authenticate,authorizeAdmin, deleteProductById);


export default router;
