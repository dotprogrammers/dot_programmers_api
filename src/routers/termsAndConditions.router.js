import express from "express";
import multer from "multer";
import {
  getTermsAndConditions,
  updateTermsAndConditions,
} from "../controllers/termsAndConditions.controller.js";

const upload = multer();
const termsAndConditionsRouter = express.Router();

termsAndConditionsRouter.get("/terms-and-conditions", getTermsAndConditions);
termsAndConditionsRouter.patch(
  "/update-terms-and-conditions",
  upload.none(),
  updateTermsAndConditions
);

export default termsAndConditionsRouter;
