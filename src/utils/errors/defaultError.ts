import { Request, Response, NextFunction } from 'express';
import CustomError from './customError';

const errorHandler = (err: CustomError, _req: Request, res: Response, _next: NextFunction) => {
  const message = err.message || 'Server Error Occurred';
  const status = err.status || 500; 

  res.status(status).json({
    message,
    status,
  });
};

export default errorHandler;