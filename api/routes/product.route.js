import express from "express";
import { createProduct, createProductReview, deleteProduct, deleteReview, getProduct, getProductReviews, getProducts, updateProduct } from "../controllers/product.controller.js";
import { verifyToken } from "../utils/verifyUser.js";


const route = express.Router();

route.post("/create", verifyToken("seller"), createProduct);
route.delete("/delete/:id", verifyToken("seller"), deleteProduct);
route.put('/update/:id', verifyToken("seller"), updateProduct);
route.get('/get/:id', getProduct);
route.get("/get", getProducts);
route.put("/review", verifyToken(), createProductReview);
route.get("/reviews", getProductReviews);
route.delete("/reviews", verifyToken(), deleteReview);

export default route;