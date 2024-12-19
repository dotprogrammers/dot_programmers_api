import express from "express";
import {
  addService,
  deleteService,
  getServices,
  updateService,
  viewService,
} from "../controllers/service.controller.js";
import paginationMiddleware from "../middlewares/pagination.middleware.js";
import { upload } from "../upload/upload.js";
import verifyToken from "./../middlewares/verifyToken.js";

const serviceRouter = express.Router();

serviceRouter.get("/services", paginationMiddleware, getServices);
serviceRouter.post(
  "/add-service",
  verifyToken,
  upload.single("image"),
  addService
);
serviceRouter.delete("/delete-service/:id", verifyToken, deleteService);
serviceRouter.patch(
  "/update-service",
  verifyToken,
  upload.single("image"),
  updateService
);

serviceRouter.get("/view-service/:id", verifyToken, viewService);
export default serviceRouter;
