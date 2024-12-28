import express from "express";
import multer from "multer";
import {
  getOurTestimonial,
  updateOurTestimonial,
} from "../controllers/ourTestimonial.controller.js";

const upload = multer();
const ourTestimonialRouter = express.Router();

ourTestimonialRouter.get("/our-testimonial", getOurTestimonial);
ourTestimonialRouter.patch(
  "/update-our-testimonial",
  upload.none(),
  updateOurTestimonial
);

export default ourTestimonialRouter;
