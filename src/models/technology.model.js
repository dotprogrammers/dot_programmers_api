import { model, Schema } from "mongoose";

const technologySchema = new Schema(
  {
    title: { type: String, required: [true, "Technology title required!"] },
    category: {
      type: String,
      required: [true, "Technology category required!"],
    },
    description: {
      type: String,
      required: [true, "Technology Description required!"],
    },
    image: { type: String, required: [true, "Technology image required!"] },
    imagePublicId: { type: String },
    status: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const Technology = model("Technology", technologySchema, "Technology");

export default Technology;
