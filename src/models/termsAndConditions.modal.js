import { model, Schema } from "mongoose";

const termsAndConditionsSchema = new Schema(
  {
    description: {
      type: String,
      required: [true, "Description required!"],
    },
  },
  { timestamps: true }
);

const TermsAndConditions = model(
  "TermsAndConditions",
  termsAndConditionsSchema,
  "TermsAndConditions"
);

export default TermsAndConditions;
