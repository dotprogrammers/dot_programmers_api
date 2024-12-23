import { model, Schema } from "mongoose";

const aboutUsSchema = new Schema(
  {
    shortTitle: {
      type: String,
      required: [true, "About us short title is required!"],
    },
    description: {
      type: String,
      required: [true, "About us description is required!"],
    },
    ourMission: {
      type: String,
      required: [true, "Our mission is required!"],
    },
    ourVision: {
      type: String,
      required: [true, "Our vision is required!"],
    },
  },
  {
    timestamps: true,
  }
);

const AboutUs = model("AboutUs", aboutUsSchema, "AboutUs");
export default AboutUs;
