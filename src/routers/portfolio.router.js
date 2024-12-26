import express from "express";
import {
  addPortfolio,
  deletePortfolio,
  getAllPortfolios,
  getPortfolio,
  updatePortfolio,
  viewPortfolio,
} from "../controllers/portfolio.controller.js";
import paginationMiddleware from "../middlewares/pagination.middleware.js";
import verifyToken from "../middlewares/verifyToken.js";
import { upload } from "../upload/upload.js";

const portfolioRouter = express.Router();

portfolioRouter.get("/portfolio", paginationMiddleware, getPortfolio);
portfolioRouter.get("/all-portfolios", getAllPortfolios);
portfolioRouter.post(
  "/add-portfolio",
  verifyToken,
  upload.single("image"),
  addPortfolio
);
portfolioRouter.delete("/delete-portfolio/:id", verifyToken, deletePortfolio);
portfolioRouter.patch(
  "/update-portfolio",
  verifyToken,
  upload.single("image"),
  updatePortfolio
);

portfolioRouter.get("/view-portfolio/:id", verifyToken, viewPortfolio);
export default portfolioRouter;
