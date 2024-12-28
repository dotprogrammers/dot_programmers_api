import express from "express";
import multer from "multer";
import {
  getOurPortfolio,
  updateOurPortfolio,
} from "../controllers/ourPortfolio.controller.js";

const upload = multer();
const ourPortfolioRouter = express.Router();

ourPortfolioRouter.get("/our-portfolio", getOurPortfolio);
ourPortfolioRouter.patch(
  "/update-our-portfolio",
  upload.none(),
  updateOurPortfolio
);

export default ourPortfolioRouter;
