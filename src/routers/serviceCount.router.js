import express from "express";
import {
  addServiceCount,
  deleteServiceCount,
  getServicesCounts,
  updateServiceCount,
} from "../controllers/serviceCount.controller.js";
import paginationMiddleware from "../middlewares/pagination.middleware.js";
import verifyToken from "../middlewares/verifyToken.js";
import { upload } from "../upload/upload.js";

const serviceCountRouter = express.Router();

serviceCountRouter.get(
  "/services-counts",
  paginationMiddleware,
  getServicesCounts
);
serviceCountRouter.post(
  "/add-service-count",
  verifyToken,
  upload.single("image"),
  addServiceCount
);
serviceCountRouter.delete(
  "/delete-service-count/:id",
  verifyToken,
  deleteServiceCount
);
serviceCountRouter.patch(
  "/update-service-count",
  verifyToken,
  upload.single("image"),
  updateServiceCount
);

export default serviceCountRouter;
