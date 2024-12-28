import express from "express";
import multer from "multer";
import {
  getConsultation,
  updateConsultation,
} from "../controllers/consultation.controller.js";

const upload = multer();
const consultationRouter = express.Router();

consultationRouter.get("/consultation", getConsultation);
consultationRouter.patch(
  "/update-consultation",
  upload.none(),
  updateConsultation
);

export default consultationRouter;
