import express from "express";

import { getAdmin, loginUser, logout } from "../controllers/auth.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
const authRouter = express.Router();

// User registration and login routes
authRouter.post("/login", loginUser);
authRouter.post("/logout", logout);
authRouter.get("/admin", verifyToken, getAdmin);

export default authRouter;
