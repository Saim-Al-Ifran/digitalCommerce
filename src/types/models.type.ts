
import mongoose,{Document} from 'mongoose';

interface IRefreshToken {
    token: string;
  }
  
export interface IUser extends Document {
    username: string;
    email: string;
    image:string;
    password: string;
    role: string;
    isActive:boolean;
    refreshTokens: IRefreshToken[];
    matchPassword: (password: string) => Promise<boolean>;
  }
  
export interface ICategory extends Document {
    title: string;
    description: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image?: string;
  rating: number;
  stockQuantity: number;
  category: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

 
  