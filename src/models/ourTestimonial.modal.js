import { model, Schema } from "mongoose";

const ourTestimonialSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title required!"],
    },
    description: {
      type: String,
      required: [true, "Description required!"],
    },
    totalClientCount: {
      type: String,
      required: [true, "Total client count required!"],
    },
    totalProjectCount: {
      type: Number,
      required: [true, "Total project count required!"],
    },
    totalReviewCount: {
      type: String,
      required: [true, "Total review count required!"],
    },
  },
  { timestamps: true }
);

const OurTestimonial = model(
  "OurTestimonial",
  ourTestimonialSchema,
  "OurTestimonial"
);

export default OurTestimonial;
