import Product from "../model/product.model.js";
import {errorHandler} from "../utils/error.js"

export const createProduct = async(req,res,next)=>{
    try{
        const product = await Product.create(req.body);
        return res.status(201).json(product);
    }
    catch(error){
        next(error);
    }
};

export const deleteProduct = async( req, res, next )=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(errorHandler(404, "Product Not Found"));
    }
    if (req.user.id !== product.userRef.toString()){
        return next(errorHandler(401, "You can only delete your own product"));
    }
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted");
    } catch (error) {
        next(error);
    }
}

export const updateProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id).catch((error)=>{});
    if (!product) {
    return next(errorHandler(404, 'Product not found!'));
  }
  if (req.user.id !== product.userRef) {
    return next(errorHandler(401, 'You can only update your own products!'));
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return next(errorHandler(404, 'Product not found!'));
      }
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  
}

export const getProducts = async(req, res, next) =>{
  try{
    const limit =parseInt(req.query.limit) || 12;
    const startIndex = parseInt(req.query.startIndex) || 1;
    let offer = req.query.offer;
    const productsCount = await Product.countDocuments();

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }
    
    let clotheType= req.query.clotheType
    if (clotheType === undefined || clotheType === 'clotheTypeAll') {
      clotheType = { $in: ['Work', 'Fashion', 'Casual'] };
    }

    let type= req.query.type
    if (type === undefined || type === 'allType') {
      type = { $in: ['T-Shirt', 'Shirt', 'Pants'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const skip = limit * (startIndex-1);

    const products = await Product.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      clotheType,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(skip)
      .then(products => 
        products.sort((a, b) => b.quantity - a.quantity || a.name.localeCompare(b.name))
      );
      const currentPageProductsCount=products.length;

      return res.status(200).json({products, productsCount, currentPageProductsCount });
  }
  catch(error){
    next(error);
  }
}

export const createProductReview = async( req, res, next)=>{
  try{

    const {rating, comment, productId} = req.body;
    
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
    
    const product = await Product.findById(productId);
    
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
      );
      
      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
    }
    let avg = 0;
    
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
    
    product.ratings = avg / product.reviews.length;
    
    await product.save({ validateBeforeSave: false });
    
    res.status(200).json({
      success: true,
    });
  }
  catch(error){
    res.status(500).json({
      message: error.message
    });
  }
}

export const getProductReviews= async(req, res, next)=>{
  try{const product = await Product.findById(req.body.id);
  if (!product) {
    return next(errorHandler(404, "Product not found" ));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });}
  catch(error){
    res.status(500).json({
      message: error.message
    });
  }
}

export const deleteReview = async(req, res, next)=>{
  try {
    const product = await Product.findById(req.body.productId);

  if (!product) {
    return next(errorHandler(404, "Product not found"));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.body.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.body.productId,
    {
      reviews,
      ratings
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}