import express from "express";
import {
  addTestimonial,
  deleteTestimonial,
  getTestimonial,
  updateTestimonial,
} from "../controllers/testimonial.controller.js";
import paginationMiddleware from "../middlewares/pagination.middleware.js";
import verifyToken from "../middlewares/verifyToken.js";
import { upload } from "../upload/upload.js";

const testimonialRouter = express.Router();

testimonialRouter.get("/testimonial", paginationMiddleware, getTestimonial);
testimonialRouter.post(
  "/add-testimonial",
  verifyToken,
  upload.single("image"),
  addTestimonial
);
testimonialRouter.delete(
  "/delete-testimonial/:id",
  verifyToken,
  deleteTestimonial
);
testimonialRouter.patch(
  "/update-testimonial",
  verifyToken,
  upload.single("image"),
  updateTestimonial
);

export default testimonialRouter;
