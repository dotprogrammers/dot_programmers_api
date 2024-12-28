import { model, Schema } from "mongoose";

const ourServicesSchema = new Schema(
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

const OurServices = model("OurServices", ourServicesSchema, "OurServices");

export default OurServices;
