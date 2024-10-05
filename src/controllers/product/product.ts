import { Request, Response, NextFunction } from 'express';
import Product from '../../models/Product';
import CustomError from '../../utils/errors/customError';
import { uploadFileToCloudinary } from '../../utils/fileUpload';
import { TryCatch } from '../../middlewares/TryCatch';
import paginate from '../../utils/paginate';
import { CustomRequest } from '../../types/type';
import Category from '../../models/Category';
import { SortOrder } from 'mongoose';

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
 