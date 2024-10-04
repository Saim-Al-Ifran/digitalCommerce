import mongoose, {Schema } from 'mongoose';
import { ICategory } from '../types/models.type';

 

const CategorySchema = new Schema<ICategory>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,  
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true  
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true  
    }
});
 
const Category = mongoose.model<ICategory>('Category', CategorySchema);

export default Category;