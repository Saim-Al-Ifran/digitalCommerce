import { Request, Response, NextFunction } from 'express';
import User from "../../models/User";
import CustomError from '../../utils/errors/customError';
import { TryCatch } from '../../middlewares/TryCatch';

export const getAllUsers = TryCatch(async (_req: Request, res: Response, next: NextFunction) => {
    const users = await User.find({ role: 'user' });
    
    if (users.length === 0) {
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
 