import { model, Schema } from "mongoose";

const contactUsSchema = new Schema(
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

const ContactUs = model("ContactUs", contactUsSchema, "ContactUs");

export default ContactUs;
