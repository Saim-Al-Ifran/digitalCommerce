import express from 'express';
import authenticate from '../middlewares/auth/authenticate';
import authorizeAdmin from '../middlewares/auth/authorizeAdmin';
import upload from '../middlewares/uploadFile/uploadFile';
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controllers/category/category';
const router = express.Router();

router.get('/categories',getCategories );
router.get('/categories/:id', authenticate, authorizeAdmin, getCategory);
router.post('/category', authenticate, authorizeAdmin,upload.single('image'), createCategory);
router.put('/categories/:id', authenticate, authorizeAdmin, upload.single('image'), updateCategory);
router.delete('/categories/:id', authenticate, authorizeAdmin, deleteCategory);

export default router;