import express from "express";
import multer from "multer";
import {
  getOurTechnology,
  updateOurTechonolgy,
} from "../controllers/ourTechnology.controller.js";

const upload = multer();
const ourTechnologyRouter = express.Router();

ourTechnologyRouter.get("/our-technology", getOurTechnology);
ourTechnologyRouter.patch(
  "/update-our-technology",
  upload.none(),
  updateOurTechonolgy
);

export default ourTechnologyRouter;
