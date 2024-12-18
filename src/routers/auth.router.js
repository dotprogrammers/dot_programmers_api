import express from "express";

import multer from "multer";
import { loginUser, logout } from "../controllers/auth.controller.js";
const authRouter = express.Router();
const upload = multer();

// User registration and login routes
authRouter.post("/login", upload.none(), loginUser);
authRouter.post("/logout", logout);

export default authRouter;
