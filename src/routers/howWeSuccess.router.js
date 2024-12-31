import express from "express";
import multer from "multer";
import {
  addHowWeSuccess,
  deleteHowWeSuccess,
  getHowWeSuccess,
  updateHowWeSuccess,
} from "../controllers/howWeSuccess.controller.js";
import paginationMiddleware from "../middlewares/pagination.middleware.js";
import verifyToken from "../middlewares/verifyToken.js";

const howWeSuccessRouter = express.Router();
const upload = multer();

howWeSuccessRouter.get(
  "/how-we-success",
  paginationMiddleware,
  getHowWeSuccess
);
howWeSuccessRouter.post(
  "/add-how-we-success",
  verifyToken,
  upload.none(),
  addHowWeSuccess
);
howWeSuccessRouter.delete(
  "/delete-how-we-success/:id",
  verifyToken,
  deleteHowWeSuccess
);
howWeSuccessRouter.patch(
  "/update-how-we-success",
  verifyToken,
  upload.none(),
  updateHowWeSuccess
);

export default howWeSuccessRouter;
