import express from "express";
import multer from "multer";
import {
  getContactInfo,
  updateContactInfo,
} from "../controllers/contactInfo.controller.js";

const upload = multer();
const contactInfoRouter = express.Router();

contactInfoRouter.get("/contact-info", getContactInfo);
contactInfoRouter.patch(
  "/update-contact-info",
  upload.none(),
  updateContactInfo
);

export default contactInfoRouter;
