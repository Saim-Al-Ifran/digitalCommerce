import { Request,NextFunction,Response } from "express";
export const TryCatch = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};
