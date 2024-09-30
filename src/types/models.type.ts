
import{Document} from 'mongoose';

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
  