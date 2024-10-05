// types.ts
import { IUser } from './models.type';
import { ParsedQs } from 'qs';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      pagination?: {
        page: number;
        limit: number;
      };
    }
  }
}

export interface CustomRequest extends Request {
  query: {
    [key: string]: string | ParsedQs | string[] | ParsedQs[]; // Index signature for other query params
  };
  pagination?: {
    page: number;
    limit: number;
  };
}


