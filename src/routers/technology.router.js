import express from "express";
import {
  addTechnology,
  deleteTechnology,
  getTechnology,
  updateTechnology,
} from "../controllers/technology.controller.js";
import paginationMiddleware from "../middlewares/pagination.middleware.js";
import verifyToken from "../middlewares/verifyToken.js";
import { upload } from "../upload/upload.js";

const technologyRouter = express.Router();

technologyRouter.get("/technology", paginationMiddleware, getTechnology);
technologyRouter.post(
  "/add-technology",
  verifyToken,
  upload.single("image"),
  addTechnology
);
technologyRouter.delete(
  "/delete-technology/:id",
  verifyToken,
  deleteTechnology
);
technologyRouter.patch(
  "/update-technology",
  verifyToken,
  upload.single("image"),
  updateTechnology
);

export default technologyRouter;
