import { Request, Response, NextFunction } from 'express';
import User from "../../models/User";
import CustomError from '../../utils/errors/customError';
import { TryCatch } from '../../middlewares/TryCatch';
import paginate from '../../utils/paginate';
import { CustomRequest } from '../../types/type';

export const getAllUsers = TryCatch(async (req: CustomRequest, res: Response, next: NextFunction) => {
    
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    if (page <= 0 || limit <= 0) {
        return next(new CustomError('Invalid page or limit parameters', 400));
    }

    const users = await paginate(User,{ role: 'user' },page,limit);
    
    if (users.data.length === 0) {
        return next(new CustomError('No users found', 404));
    }

    res.status(200).json(users);
});


export const deleteUser = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
        return next(new CustomError('User not found', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'User deleted successfully',
    });
});


const getProfile = async(req:Request,res:Response,next:NextFunction)=>{};
const updateProfile = async(req:Request,res:Response,next:NextFunction)=>{};
 