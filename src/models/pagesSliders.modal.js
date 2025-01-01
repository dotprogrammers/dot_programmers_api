import { model, Schema } from "mongoose";

const pagesSlidersSchema = new Schema(
  {
    title: { type: String, required: [true, "Title required!"] },
    description: {
      type: String,
      required: [true, "Description required!"],
    },
    pageName: { type: String, required: [true, "Page name required!"] },
    image: { type: String, required: [true, "Image required!"] },
    imagePublicId: { type: String },
    status: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const PagesSlider = model("PagesSlider", pagesSlidersSchema, "PagesSlider");

export default PagesSlider;
