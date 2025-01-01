import express from "express";
import {
  addPagesSlider,
  deletePagesSlider,
  getPagesSliders,
  updatePagesSlider,
} from "../controllers/pagesSliders.controller.js";
import paginationMiddleware from "../middlewares/pagination.middleware.js";
import verifyToken from "../middlewares/verifyToken.js";
import { upload } from "../upload/upload.js";

const pagesSliderRouter = express.Router();

pagesSliderRouter.get("/pages-slider", paginationMiddleware, getPagesSliders);
pagesSliderRouter.post(
  "/add-pages-slider",
  verifyToken,
  upload.single("image"),
  addPagesSlider
);
pagesSliderRouter.delete(
  "/delete-pages-slider/:id",
  verifyToken,
  deletePagesSlider
);
pagesSliderRouter.patch(
  "/update-pages-slider",
  verifyToken,
  upload.single("image"),
  updatePagesSlider
);

export default pagesSliderRouter;
