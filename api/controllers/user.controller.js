import User from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import Product from "../model/product.model.js"

export const getUser = async(req, res, next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(401,'You can only view your own account'));
    try{
        const user = await User.findById(req.params.id);
        const { password: pass, ...rest } = user._doc;
        res.status(200).json(rest)
    }
    catch (error) {
        next(error)
    }
}

export const updateUser = async(req, res, next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(401,'You can only update your own account'));
    try {
        if(req.body.enteredPassword){
            if(req.body.enteredPassword !== req.body.confirmedPassword) return next(errorHandler(401,'Passwords do not match'));
            req.body.enteredPassword = bcryptjs.hashSync(req.body.enteredPassword,10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                name: req.body.name,
                email: req.body.email,
                password: req.body.enteredPassword,
                role: req.body.role,
                cart: req.body.cart
            }
        }, {new: true})

        const { password: pass, ...rest } = updatedUser._doc;
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async(req, res, next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(401,'You can only delete your own account'));
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('User has been deleted!');
    } catch (error) {
        next(error);
    }
}

export const getUserProducts = async (req, res, next) => {
    if (req.user.id === req.params.id) {
      try {
        const products = await Product.find({ userRef: req.params.id });
        res.status(200).json(products);
      } catch (error) {
        next(error);
      }
    } else {
      return next(errorHandler(401, 'You can only view your own products!'));
    }
  };