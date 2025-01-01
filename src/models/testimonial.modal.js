import { model, Schema } from "mongoose";

const testimonialSchema = new Schema(
  {
    name: { type: String, required: [true, "Name required!"] },
    address: { type: String, required: [true, "Address required!"] },
    rating: { type: Number, required: [true, "Rating required!"] },
    review: {
      type: String,
      required: [true, "Review required!"],
    },
    image: { type: String, required: [true, "Image required!"] },
    imagePublicId: { type: String },
    status: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const Testimonial = model("Testimonial", testimonialSchema, "Testimonial");

export default Testimonial;
