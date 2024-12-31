import { model, Schema } from "mongoose";

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Contact = model("Contact", contactSchema, "Contact");
export default Contact;
