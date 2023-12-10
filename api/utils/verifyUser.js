import { errorHandler } from "./error.js";
import User from '../model/user.model.js'
import jwt from "jsonwebtoken";

export const verifyToken = (role) => async(req, res, next) => {
    const { access_token } = req.cookies;
    const token = access_token;
    try{
        
        if (!token) {
            return next(errorHandler(401,"Please Login to access this resource"));
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = await User.findById(decodedData.id);
        if(!role){
            role=req.user.role;
        }
        console.log(role);

        
        if(req.user.role !== role) return next(errorHandler(401,"You are not authorised to perform this task"));
        next();
    }
    catch(error){
        return next(errorHandler(404,error.message));
    }
    
};
