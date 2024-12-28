import express from "express";
import multer from "multer";
import {
  getOurServices,
  updateOurServices,
} from "../controllers/ourServices.controller.js";

const upload = multer();
const ourServicesRouter = express.Router();

ourServicesRouter.get("/our-services", getOurServices);
ourServicesRouter.patch(
  "/update-our-services",
  upload.none(),
  updateOurServices
);

export default ourServicesRouter;
