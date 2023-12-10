import express from "express";
import { google, signin, signout, signup } from "../controllers/auth.controller.js";

const route = express.Router();

route.post("/sign-up", signup);
route.post("/sign-in", signin);
route.post("/google", google);
route.get("/sign-out", signout);

export default route;