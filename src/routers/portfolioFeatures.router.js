import express from "express";
import {
  addPortfolioFeatures,
  deletePortfolioFeatures,
  getPortfolioFeatures,
  updatePortfolioFeatures,
  viewPortfolioFeatures,
} from "../controllers/portfolioFeatures.controller.js";
import paginationMiddleware from "../middlewares/pagination.middleware.js";
import verifyToken from "../middlewares/verifyToken.js";
import { upload } from "../upload/upload.js";

const portfolioFeaturesRouter = express.Router();

portfolioFeaturesRouter.get(
  "/portfolio-features",
  paginationMiddleware,
  getPortfolioFeatures
);
portfolioFeaturesRouter.post(
  "/add-portfolio-feature",
  verifyToken,
  upload.none(),
  addPortfolioFeatures
);
portfolioFeaturesRouter.delete(
  "/delete-portfolio-feature/:id",
  verifyToken,
  deletePortfolioFeatures
);
portfolioFeaturesRouter.patch(
  "/update-portfolio-feature",
  verifyToken,
  upload.none(),
  updatePortfolioFeatures
);

portfolioFeaturesRouter.get(
  "/view-portfolio-feature/:id",
  verifyToken,
  viewPortfolioFeatures
);
export default portfolioFeaturesRouter;
