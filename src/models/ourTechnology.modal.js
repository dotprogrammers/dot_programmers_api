import { model, Schema } from "mongoose";

const ourTechnologySchema = new Schema(
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

const OurTechnology = model(
  "OurTechnology",
  ourTechnologySchema,
  "OurTechnology"
);

export default OurTechnology;
