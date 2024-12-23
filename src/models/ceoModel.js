import { model, Schema } from "mongoose";

const ceoSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
    },
    designation: {
      type: String,
      required: [true, "Designation is required!"],
    },
    say: {
      type: String,
      required: [true, "Say is required!"],
    },
    image: {
      type: String,
      required: [true, "Image is required!"],
    },
    imagePublicId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Ceo = model("Ceo", ceoSchema, "Ceo");
export default Ceo;
