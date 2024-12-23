import express from "express";
import { getCeo, updateCeo } from "../controllers/Ceo.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import { upload } from "../upload/upload.js";

const ceoRouter = express.Router();

ceoRouter.get("/ceo", getCeo);

ceoRouter.patch("/update-ceo", verifyToken, upload.single("image"), updateCeo);

export default ceoRouter;
