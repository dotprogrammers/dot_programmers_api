import express from "express";
import multer from "multer";
import {
  getContactuser,
  storeContactUser,
} from "../controllers/contact.controller.js";

const upload = multer();
const contactRouter = express.Router();

contactRouter.get("/contact", getContactuser);
contactRouter.post("/contact", upload.none(), storeContactUser);

export default contactRouter;
