import express from "express";
import multer from "multer";
import {
  getPrivacyPolicy,
  updatePrivacyPolicy,
} from "../controllers/privacyPolicy.controller.js";

const upload = multer();
const privacyPolicyRouter = express.Router();

privacyPolicyRouter.get("/privacy-policy", getPrivacyPolicy);
privacyPolicyRouter.patch(
  "/update-privacy-policy",
  upload.none(),
  updatePrivacyPolicy
);

export default privacyPolicyRouter;
