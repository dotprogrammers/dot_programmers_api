import express from "express";
import multer from "multer";
import {
  getSubscribeUser,
  storeSubscribeUser,
} from "../controllers/subscribe.controller.js";

const upload = multer();
const subscribeRouter = express.Router();

subscribeRouter.get("/subscribe", getSubscribeUser);
subscribeRouter.post(
  "/subscribe-newsletter",
  upload.none(),
  storeSubscribeUser
);

export default subscribeRouter;
