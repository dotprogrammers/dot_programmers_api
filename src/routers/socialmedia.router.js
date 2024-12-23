import express from "express";
import multer from "multer";
import {
  getSocialMedia,
  updateSocialMedia,
} from "../controllers/socialMedia.controller.js";

const upload = multer();
const socialMediaRouter = express.Router();

socialMediaRouter.get("/social-media", getSocialMedia);
socialMediaRouter.patch(
  "/update-social-media",
  upload.none(),
  updateSocialMedia
);

export default socialMediaRouter;
