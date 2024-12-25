import express from "express";
import multer from "multer";
import {
  addCoreValue,
  deleteCoreValue,
  getCoreValue,
  updateCoreValue,
} from "../controllers/coreValue.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
const upload = multer();
const coreValueRouter = express.Router();

coreValueRouter.get("/core-values", getCoreValue);
coreValueRouter.post(
  "/add-core-value",
  verifyToken,
  upload.none(),
  addCoreValue
);
coreValueRouter.delete("/delete-core-value/:id", verifyToken, deleteCoreValue);

coreValueRouter.patch(
  "/update-core-value",
  verifyToken,
  upload.none(),
  updateCoreValue
);

export default coreValueRouter;
