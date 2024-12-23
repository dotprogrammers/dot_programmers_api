import express from "express";
import {
  getLogoAndFavicon,
  updateLogoAndFavicon,
} from "../controllers/logoAndFavicon.controller.js";
import { upload } from "../upload/upload.js";
import verifyToken from "./../middlewares/verifyToken.js";

const logoAndFaviconRouter = express.Router();

logoAndFaviconRouter.get("/logo-and-favicon", getLogoAndFavicon);

logoAndFaviconRouter.patch(
  "/update-logo-and-favicon",
  verifyToken,
  upload.fields([
    { name: "logoLink", maxCount: 1 },
    { name: "faviconLink", maxCount: 1 },
  ]),
  updateLogoAndFavicon
);

export default logoAndFaviconRouter;
