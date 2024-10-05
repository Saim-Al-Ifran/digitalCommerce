import { Request, Response, NextFunction } from 'express';
import Product from '../../models/Product';
import CustomError from '../../utils/errors/customError';
import { uploadFileToCloudinary } from '../../utils/fileUpload';
import { TryCatch } from '../../middlewares/TryCatch';
 

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

 