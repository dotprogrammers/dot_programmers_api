import { model, Schema } from "mongoose";

const coreValueSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required!"],
    },
    description: {
      type: String,
      required: [true, "Description is required!"],
    },
    status: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

const CoreValue = model("CoreValue", coreValueSchema, "CoreValue");
export default CoreValue;
