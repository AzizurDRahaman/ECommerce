import Order from "../model/order.model.js";
import User from "../model/user.model.js";
import Product from "../model/product.model.js";
import { errorHandler } from "../utils/error.js";

export const newOrder = async (req, res, next) => {
  try {
    const { userId, orderItems } = req.body;

    // Check product availability and create the order
    for (const item of orderItems) {
      const { productId, quantity } = item;

      // Find the product and check its available quantity
      const product = await Product.findById(productId);

      if (!product) {
        return next(errorHandler(404, 'Product not found'));
      }
      
      if (product.quantity < quantity) {
        return next(errorHandler(404, 'Requested Quantity is more than in stock'));
      }
    }

    // Create the order
    const order = await Order.create(req.body);

    // Update user's order history with orderId and quantity
    if (order) {
      for (const item of orderItems) {
        const { productId, quantity } = item;

        // Update user model with orderId and quantity
        await User.findOneAndUpdate(
          { _id: userId },
          {
            $push: {
              order: {
                orderId: order._id,
                quantity: quantity,
              },
            },
          },
          { new: true }
        );
    
        await User.findOneAndUpdate(
          { _id: userId },
          { $set: { cart: [] } },
          { new: true }
        );
        await Product.findByIdAndUpdate(productId, {
          $inc: { quantity: -quantity },
        });
      }
    }

    return res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getSingleOrder = async(req, res, next)=>{
    try{
        const order = await Order.findById(req.params.id).populate(
            "userId",
            "name email"
            );
    if(!order){
        return next(errorHandler(404,"Order not found with this Id"));
    }
    res.status(200).json({
        success: true,
        order,
      });
      next();
    }
      catch(error){
        return next(errorHandler(400,error.message))
      }
}

export const myOrders = async (req, res, next) => {
    try{
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  
    res.status(200).json({
      success: true,
      orders,
    });}
    catch(error){
        return(next(errorHandler(400,error.message)))
    }
  };

export const getSellerOrders = async(req, res, next)=>{
  try {
    const sellerId = req.user._id; // Assuming you have user info in req.user
    const orders = await Order.find().populate('userId', '-password').populate('orderItems.productId');
    console.log(orders)
    const sellerOrders = orders.filter(order => 
      order.orderItems.some(item => 
        String(item.productId.userRef) === String(sellerId)
      )
    );
  
    // For each order, create an object with the user name, product name, and quantity
    const result = sellerOrders.map(order => ({
      userName: order.userId.name,
      orderStatus:order.orderStatus,
      orders: order.orderItems
        .filter(item => String(item.productId.userRef) === String(sellerId))
        .map(item => ({
          productName: item.productId.name,
          quantity: item.quantity
        }))
    }));
    res.status(200).json(result);
  } catch (error) {
    return(next(errorHandler(500,error.message)))
  }
}