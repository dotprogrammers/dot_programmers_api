import express from "express";
import multer from "multer";
import {
  getContactUs,
  updateContactUs,
} from "../controllers/contactUs.controller.js";

const upload = multer();
const contactUsRouter = express.Router();

contactUsRouter.get("/contact-us", getContactUs);
contactUsRouter.patch("/update-contact-us", upload.none(), updateContactUs);

export default contactUsRouter;
