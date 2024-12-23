import { model, Schema } from "mongoose";

const contactInfoSchema = new Schema(
  {
    phoneNumberFirst: {
      type: String,
      required: [true, "1st phone number is required!"],
    },
    phoneNumberSecond: {
      type: String,
      required: [true, "2nd phone number is required!"],
    },
    emailAddressFirst: {
      type: String,
      required: [true, "1st email address is required!"],
    },
    emailAddressSecond: {
      type: String,
      required: [true, "2nd email address is required!"],
    },
    contactAddress: {
      type: String,
      required: [true, "Contact address is required!"],
    },
  },
  { timestamps: true }
);

const ContactInfo = model("ContactInfo", contactInfoSchema, "ContactInfo");

export default ContactInfo;
