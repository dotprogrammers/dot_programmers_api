import { model, Schema } from "mongoose";

const howWeSuccessSchema = new Schema(
  {
    title: { type: String, required: [true, "Title required!"] },
    description: {
      type: String,
      required: [true, "Description required!"],
    },
    status: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const HowWeSuccess = model("HowWeSuccess", howWeSuccessSchema, "HowWeSuccess");

export default HowWeSuccess;
