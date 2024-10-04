import { Request, Response, NextFunction } from 'express';
import User from '../../models/User';
import jwt from 'jsonwebtoken';
import { refreshSecretKey, secretKey } from '../../secret';
import CustomError from '../../utils/errors/customError';

// User Registration
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new CustomError('User already exists',400))
    }

    const newUser = new User({ username, email, password });
    await newUser.save();
    
    const userResponse = {
        username:username,
        email:email
    }
    res.status(201).json({ message: 'User registered successfully', user: userResponse });
  } catch (error:any) {
      next(new CustomError(error.message,500));
  }
};

// User Login
export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const payload  = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  };


    const accessToken = jwt.sign(payload,secretKey, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, refreshSecretKey, { expiresIn: '7d' });
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({message:'Login successfull',refreshToken,accessToken, user:payload });
  } catch (error:any) {
    next(new CustomError(error.message,500));
  }
};

// Admin Login
export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new CustomError('Invalid email or password',401));
    }

    const payload  = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    const accessToken = jwt.sign(payload,secretKey, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, refreshSecretKey, { expiresIn: '7d' });
    user.refreshTokens.push({ token: refreshToken });
    await user.save();
    
    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({message:'Login successfull',refreshToken,accessToken, user:payload });
  } catch (error:any) {
     next(new CustomError(error.message,500));
  }
};



//todo
export const refreshTokenController = async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return next(new CustomError('Refresh token not provided', 403));
    }

    let payload: any;
    try {
      payload = jwt.verify(refreshToken, refreshSecretKey);
      
    } catch (error) {
      throw new CustomError('Invalid refresh token', 403);
    }
    const user = await User.findOne({_id:payload.id});

    if (!user || !user.refreshTokens.some((rt) => rt.token === refreshToken)) {
      return next(new CustomError('Invalid refresh token', 403));
    }

    const newPayload  = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
    const newAccessToken = jwt.sign(newPayload,secretKey,{expiresIn:'1hr'});
    const newRefreshToken = jwt.sign(newPayload,refreshSecretKey,{expiresIn:'7d'});
    user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== refreshToken);
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();

    res.cookie('accessToken', newAccessToken, { httpOnly: true, maxAge: 3600000 });
    res.cookie('refreshToken',newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({newAccessToken,newRefreshToken});

  } catch (err:any) {
    next(new CustomError(err.message,500));
  }
}
