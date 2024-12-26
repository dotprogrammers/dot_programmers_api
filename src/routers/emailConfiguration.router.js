import express from "express";
import multer from "multer";
import {
  getEmailConfiguration,
  updateEmailConfiguration,
} from "../controllers/emailConfiguration.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
const upload = multer();
const emailConfigurationRouter = express.Router();

emailConfigurationRouter.get("/email-configuration", getEmailConfiguration);

emailConfigurationRouter.patch(
  "/update-email-configuration",
  verifyToken,
  upload.none(),
  updateEmailConfiguration
);

export default emailConfigurationRouter;
