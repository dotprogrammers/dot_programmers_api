import express from "express";
import multer from "multer";
import {
  getAboutUs,
  updateAboutUs,
} from "../controllers/aboutUs.controller.js";

const upload = multer();
const aboutUsRouter = express.Router();

aboutUsRouter.get("/about-us", getAboutUs);
aboutUsRouter.patch("/update-about-us", upload.none(), updateAboutUs);

export default aboutUsRouter;
