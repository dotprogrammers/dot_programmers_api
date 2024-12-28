import { model, Schema } from "mongoose";

const consultationSchema = new Schema(
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

const Consultation = model("Consultation", consultationSchema, "Consultation");

export default Consultation;
