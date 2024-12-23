import express from "express";
import multer from "multer";
import {
  getSiteConfiguration,
  updateSiteConfiguration,
} from "../controllers/siteConfiguration.controller.js";

const upload = multer();
const siteConfigurationRouter = express.Router();

siteConfigurationRouter.get("/site-configuration", getSiteConfiguration);
siteConfigurationRouter.patch(
  "/update-site-configuration",
  upload.none(),
  updateSiteConfiguration
);

export default siteConfigurationRouter;
