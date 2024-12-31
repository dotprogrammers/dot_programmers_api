import { model, Schema } from "mongoose";

const howToSuccessSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title required!"],
    },
    description: {
      type: String,
      required: [true, "Description required!"],
    },
  },
  { timestamps: true }
);

const HowToSuccess = model("HowToSuccess", howToSuccessSchema, "HowToSuccess");

export default HowToSuccess;
