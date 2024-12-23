import { model, Schema } from "mongoose";

const serviceSchema = new Schema(
  {
    name: { type: String, required: [true, "Service name required!"] },
    description: {
      type: String,
      required: [true, "Service Description required!"],
    },
    image: { type: String, required: [true, "Service image required!"] },
    imagePublicId: { type: String },
    status: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const Service = model("Service", serviceSchema, "Service");

export default Service;
