import { NextFunction, Request, Response } from 'express';
 
import { deleteFileFromCloudinary } from '../../utils/delFileFromCloudinary';
import CustomError from '../../utils/errors/customError';
import Category from '../../models/Category';
import { uploadFileToCloudinary } from '../../utils/fileUpload';
import { TryCatch } from '../../middlewares/TryCatch';
 
// Get all categories
export const getCategories = TryCatch( async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
 
    const categories = await Category.find();
    if(categories.length === 0){
        return next(new CustomError('No category found!!',404));
    }
    res.status(200).json(categories);
   
});

// Get category by ID
export const getCategory = TryCatch( async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const categoryId = req.params.id;
      const category = await Category.findById({_id:categoryId});
      if (!category) {
        return next (new CustomError('Category not found', 404));
      }
      res.status(200).json(category);
    
  });

  // Create a new category
export const createCategory = TryCatch(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

      const categoryData = req.body;
      const imageFile = req.file;
      console.log(imageFile);
      
      if (imageFile) {
        const uploadResult = await uploadFileToCloudinary(imageFile);
        categoryData.image = uploadResult.secure_url;
      }
      const category = new Category(categoryData);
      await category.save();
      res.status(201).json(category); 
  });


  export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = req.params.id;
      const categoryData = req.body;
      const imageFile = req.file;

      if (imageFile) {
        const uploadResult = await uploadFileToCloudinary(imageFile);
        categoryData.imageUrl = uploadResult.secure_url;
      }
      const category = await Category.findByIdAndUpdate(categoryId , categoryData, { new: true, runValidators: true });
      if (!category) {
         next(new CustomError('Category not found', 404));
      }

      res.status(200).json(category);
    } catch (error: any) {
      next(new CustomError(error.message, error.status));
    }
  };
  

  // Delete a category by ID
  export const deleteCategory = TryCatch(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const categoryId = req.params.id;
      const category = await Category.findOne({ _id: categoryId });
   
      if (!category) {
        next(new CustomError('Category not found', 404));
      }
  
      if (category && category.image) {
        await deleteFileFromCloudinary(category.image);
      }
  
      await Category.findByIdAndDelete(categoryId);
   
  
      res.status(200).json({ message: 'Category deleted successfully' });
   
  });
  