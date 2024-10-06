import { Request, Response, NextFunction } from 'express';
import Product from '../../models/Product';
import CustomError from '../../utils/errors/customError';
import { uploadFileToCloudinary } from '../../utils/fileUpload';
import { TryCatch } from '../../middlewares/TryCatch';
import paginate from '../../utils/paginate';
import { CustomRequest } from '../../types/type';
import Category from '../../models/Category';
import { SortOrder } from 'mongoose';
import { deleteFileFromCloudinary } from '../../utils/delFileFromCloudinary';

// Add a new product
export const addProduct = TryCatch (async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
 
        const productData = req.body;
        const imageFile = req.file;
        if (imageFile) {
            const uploadResult = await uploadFileToCloudinary(imageFile);
            productData.image = uploadResult.secure_url;
          }
        const newProduct = new Product(productData);
        await newProduct.save();
        res.status(201).json(newProduct);

});

// Fetch all products
export const getAllProducts = TryCatch( async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let page = parseInt(req.query.page as string, 10) || 1;
        let limit = parseInt(req.query.limit as string, 10) || 10;
        const { search,category,sortBy} = req.query;   

        if (page <= 0 || limit <= 0) {
            return next(new CustomError('Invalid page or limit parameters', 400));
        }

        const query: any = {};
        if(search) {
          query.name = { $regex: search, $options: 'i' }
        } 

        if (category) {
            const categoryData = await Category.findOne({ title: {$regex:category,$options:'i'}});
            if (categoryData) {
              query.category = categoryData._id;   
            } else {
              return next(new CustomError('Category not found!', 404));
            }
          }

          const sort: Record<string, SortOrder> = {};
          switch (sortBy) {
              case 'price_asc':
                  sort.price = 1;
                  break;
              case 'price_desc':
                  sort.price = -1;
                  break;
              case 'date_asc':
                  sort.createdAt = 1;
                  break;
              case 'date_desc':
                  sort.createdAt = -1;
                  break;
          }

        const products = await paginate(Product,query,page,limit,sort);
        if(products.data.length === 0){
            return next(new CustomError('No products found', 404));
        }

        res.status(200).json(products);
    
});

// Fetch a single product by its ID
export const getProductById = TryCatch(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
 
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            next(new CustomError('Product not found', 404));
        }
        res.status(200).json(product);
 
});

export const updateProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const productId = req.params.id;
        const updatedData = req.body;
        const imageFile = req.file;

        if (imageFile) {
            const result = await uploadFileToCloudinary(imageFile);
            updatedData.image = result.secure_url;
            const existingProduct = await Product.findById(productId );

            if (existingProduct && existingProduct.image) {
              await deleteFileFromCloudinary(existingProduct.image);
            }
          }

        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
        if (!updatedProduct) {
            throw new CustomError('Product not found', 404);
        }
        res.status(200).json(updatedProduct);
    } catch (error: any) {
        next(new CustomError(error.message, 500));
    }
};

export const deleteProductById = TryCatch(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log('Delete endpoint hit');
    const productId = req.params.id;
    const product = await Product.findById(productId);
    
    if (!product) {
      return next(new CustomError('Product not found', 404));
    }
    if (product.image) {
      await deleteFileFromCloudinary(product.image);
    }
  
    // Delete the product
    await Product.findByIdAndDelete(productId);
    
    res.status(200).json({ message: 'Product deleted successfully' });
  });
  
 //  Fetch products in a specific category
export const getProductsByCategory = TryCatch(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  
    const categoryId = req.params.category;
    const products = await Product.find({ category: categoryId });
    if(products.length === 0){
        return next(new CustomError('No products found in this category', 404));
    }
    res.status(200).json(products);
       
});

// Fetch products with low inventory
export const getLowInventoryProducts = TryCatch(async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        const lowInventoryProducts = await Product.find({ stockQuantity: { $lt: 10 } });
        if(lowInventoryProducts.length === 0){
            return next(new CustomError('No products with low inventory', 404));
        }
        res.status(200).json(lowInventoryProducts);
});
