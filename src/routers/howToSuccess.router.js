import express from "express";
import multer from "multer";
import {
  getHowToSuccess,
  updateHowToSuccess,
} from "../controllers/howToSuccess.controller.js";

const upload = multer();
const howToSuccessRouter = express.Router();

howToSuccessRouter.get("/how-to-success", getHowToSuccess);
howToSuccessRouter.patch(
  "/update-how-to-success",
  upload.none(),
  updateHowToSuccess
);

export default howToSuccessRouter;
