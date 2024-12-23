import { model, Schema } from "mongoose";

const serviceCountSchema = new Schema(
  {
    count: { type: String, required: [true, "Count is required!"] },
    title: {
      type: String,
      required: [true, "Title is required!"],
    },
    image: { type: String, required: [true, "Icon is required!"] },
    imagePublicId: { type: String },
    status: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const ServiceCount = model("ServiceCount", serviceCountSchema, "ServiceCount");

export default ServiceCount;
