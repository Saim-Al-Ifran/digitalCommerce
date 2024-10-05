import mongoose, {Schema } from 'mongoose';
import { IProduct } from '../types/models.type';

 

const ProductSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    rating: {
        type: Number,
        default: 0,
    },
    stockQuantity: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
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

const Product = mongoose.model<IProduct>('Product', ProductSchema );

export default Product;
