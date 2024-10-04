import { IUser } from "./models.type";
declare global{
    namespace Express{
         interface Request{
             user?:IUser;
         }
    }
}