import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { getSellerOrders, getSingleOrder, myOrders, newOrder } from "../controllers/order.controller.js";

const route = express.Router();

route.post('/new',verifyToken(), newOrder);
route.get("/get/my-orders", verifyToken(), myOrders );
route.get("/get/seller-orders", verifyToken("seller"), getSellerOrders );
route.get("/get/:id", verifyToken(),getSingleOrder );

export default route;