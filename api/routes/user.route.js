import express from "express";
import { deleteUser, getUserProducts, updateUser, getUser  } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const route = express.Router();

route.get("/get/:id", verifyToken(), getUser);
route.put("/update/:id", verifyToken(), updateUser);
route.delete("/delete/:id", verifyToken(), deleteUser);
route.get("/products/:id", verifyToken("seller"), getUserProducts);


export default route;